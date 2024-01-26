from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass
class PdfBook(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=2000, blank=True, null=True)
    book = models.FileField(upload_to='pdf/')
    
    
