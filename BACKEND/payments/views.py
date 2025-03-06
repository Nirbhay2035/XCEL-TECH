import razorpay
import json
import pdfkit
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
from payments.models import Payment
from bookings.models import Booking
from django.views.decorators.csrf import csrf_exempt

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def get_razorpay_key(request):
    """Return Razorpay key to the frontend."""
    return JsonResponse({"key": settings.RAZORPAY_KEY_ID})

def create_razorpay_order(request, booking_id):
    """Create a Razorpay order for a given booking."""
    booking = get_object_or_404(Booking, id=booking_id)

    if not hasattr(booking.service, "price") or booking.service.price is None:
        return JsonResponse({"error": "Service price is missing"}, status=400)

    amount = int(booking.service.price * 100)  # Convert to paisa
    print("Booking ID:", booking.id, "Service Price:", booking.service.price)

    try:
        order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,  # Capture payment automatically
        })

        # Save payment details
        Payment.objects.create(
            booking=booking,
            amount=booking.service.price,
            razorpay_order_id=order["id"],
            payment_status="Pending",
        )

        return JsonResponse({"order_id": order["id"], "amount": amount})
    except razorpay.errors.ServerError as e:
        return JsonResponse({"error": f"Razorpay Server Error: {str(e)}"}, status=500)

    except Exception as e:
        return JsonResponse({"error": f"Internal Server Error: {str(e)}"}, status=500)


@csrf_exempt
def verify_razorpay_payment(request):
    """Verify payment from Razorpay."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            razorpay_order_id = data.get("razorpay_order_id")
            razorpay_payment_id = data.get("razorpay_payment_id")
            razorpay_signature = data.get("razorpay_signature")

            payment = get_object_or_404(Payment, razorpay_order_id=razorpay_order_id)

            # Verify Razorpay payment signature
            params_dict = {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            }

            razorpay_client.utility.verify_payment_signature(params_dict)

            # Update payment record
            payment.payment_status = "Completed"
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.save()

            return JsonResponse({"status": "Payment Successful"})
        except razorpay.errors.SignatureVerificationError:
            payment.payment_status = "Failed"
            payment.save()
            return JsonResponse({"error": "Signature verification failed"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Payment verification error: {str(e)}"}, status=500)

def generate_invoice(request, booking_id):
    """Generate and return invoice as a PDF."""
    booking = get_object_or_404(Booking, id=booking_id)
    payment = get_object_or_404(Payment, booking=booking, payment_status="Completed")

    context = {
        "booking": booking,
        "payment": payment,
        "service": booking.service
    }

    html = render_to_string("invoice_template.html", context)

    try:
        pdf = pdfkit.from_string(html, False)
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="invoice_{booking.id}.pdf"'
        return response
    except Exception as e:
        return JsonResponse({"error": f"Invoice generation failed: {str(e)}"}, status=500)
