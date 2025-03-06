from rest_framework import viewsets
from .models import Invoice
from .serializers import InvoiceSerializer  # ✅ Correct
from rest_framework.permissions import IsAuthenticated

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Invoice.objects.all()
        return Invoice.objects.filter(booking__user=self.request.user)
 