from django.urls import path
from .views import subscribe_newsletter  # Ensure correct import

urlpatterns = [
    path("subscribe/", subscribe_newsletter, name="subscribe_newsletter"),
]
