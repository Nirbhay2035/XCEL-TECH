from django.db import models

class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(help_text='Duration in days')
    category = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(upload_to="service_images/", null=True, blank=True)


    def __str__(self):
        return self.name
