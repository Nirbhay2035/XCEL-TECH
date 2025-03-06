from django.db import models
from bookings.models import Booking
from payments.models import Payment

class Invoice(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="invoice")
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name="invoice", null=True, blank=True)
    invoice_number = models.CharField(max_length=20, unique=True)
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Paid', 'Paid'), ('Overdue', 'Overdue')],
        default='Pending'
    )

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.status}"
