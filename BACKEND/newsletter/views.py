from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import NewsletterSubscriber

@api_view(["POST"])
def subscribe_newsletter(request):
    email = request.data.get("email")
    
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    # Save subscriber to database
    subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)

    if created:
        # Send confirmation email
        subject = "Thank you for subscribing!"
        message = "You have successfully subscribed to our newsletter."
        from_email = "your-email@gmail.com"  # Same as EMAIL_HOST_USER
        recipient_list = [email]

        try:
            send_mail(subject, message, from_email, recipient_list)
            return JsonResponse({"message": "Subscribed successfully! Confirmation email sent."}, status=201)
        except Exception as e:
            return JsonResponse({"error": f"Failed to send email: {str(e)}"}, status=500)

    return JsonResponse({"message": "You are already subscribed."}, status=200)
