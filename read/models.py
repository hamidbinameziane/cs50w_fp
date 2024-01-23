from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass
class DangoBook(models.Model):
    page = models.IntegerField()
    body = models.CharField(max_length=100000)
