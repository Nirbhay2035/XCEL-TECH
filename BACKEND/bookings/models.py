from django.db import models
from users.models import User
from services.models import Service

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Confirmed', 'Confirmed'), ('Cancelled', 'Cancelled')],
        default='Pending'
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Add price field

    def save(self, *args, **kwargs):
        if not self.price:  
            self.price = self.service.price  # Set price from service
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.id} - {self.user.username} - {self.service.name}"
