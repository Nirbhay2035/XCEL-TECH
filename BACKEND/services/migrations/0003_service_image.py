# Generated by Django 5.1.6 on 2025-03-04 12:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0002_service_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='image',
            field=models.URLField(blank=True, null=True),
        ),
    ]
