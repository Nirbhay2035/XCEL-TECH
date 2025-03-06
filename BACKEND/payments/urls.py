from django.urls import path
from .views import get_razorpay_key
from .views import create_razorpay_order, verify_razorpay_payment, generate_invoice

urlpatterns = [
    path('create-order/<int:booking_id>/', create_razorpay_order, name='create_order'),
    path("verify-payment/", verify_razorpay_payment, name="verify_razorpay_payment"),
    path('razorpay-key/', get_razorpay_key, name='razorpay-key'),
    path("invoice/<int:booking_id>/", generate_invoice, name="generate_invoice"),
]
