from django.db import models

# Create your models here.
class Rol(models.Model):

    MANAGER = 'manager'
    LANDLORD = 'landlord'
    REALTOR = 'realtor'
    TENANT = 'tenant'

    ROLE_CHOICES = [
        (MANAGER, 'manager'),
        (LANDLORD, 'landlord'),
        (REALTOR, 'realtor'),
        (TENANT, 'tenant'),
    ]


    name = models.CharField(max_length = 50, choices = ROLE_CHOICES, unique = True)
    state = models.BooleanField(default = True)

    def __str__(self):
        return self.name