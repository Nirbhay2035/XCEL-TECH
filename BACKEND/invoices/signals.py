from django.db.models.signals import post_save
from django.dispatch import receiver
from payments.models import Payment
from invoices.models import Invoice
import uuid
from datetime import timedelta
from django.utils.timezone import now

@receiver(post_save, sender=Payment)
def create_invoice(sender, instance, **kwargs):
    if instance.payment_status == "Completed":
        invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        Invoice.objects.create(
            booking=instance.booking,
            payment=instance,
            invoice_number=invoice_number,
            issue_date=now(),
            due_date=now() + timedelta(days=7),
            total_amount=instance.amount,
            status="Paid",
        )
