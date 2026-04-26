from django.db import models

# Create your models here.
class Rol(models.Model):

    ADMIN = 'admin'
    USER = 'user'

    ROLE_CHOICES = [
        (ADMIN, 'admin'),
        (USER, 'user'),
        
    ]


    name = models.CharField(max_length = 50, choices = ROLE_CHOICES, unique = True)
    state = models.BooleanField(default = True)

    def __str__(self):
        return self.name