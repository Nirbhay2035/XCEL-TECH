from rest_framework import generics, permissions
from .models import Service
from .serializers import ServiceSerializer

class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method == "POST":  # Restrict adding services to admins only
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]  # Allow everyone to view services

class ServiceRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin can edit/delete
