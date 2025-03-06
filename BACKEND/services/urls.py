from django.urls import path
from .views import ServiceListCreateView, ServiceRetrieveUpdateDeleteView

urlpatterns = [
    path('', ServiceListCreateView.as_view(), name='service-list-create'),
    path('<int:pk>/', ServiceRetrieveUpdateDeleteView.as_view(), name='service-detail'),
]
