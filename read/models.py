from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class PdfBook(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=2000, blank=True, null=True)
    book = models.FileField(upload_to='pdf/')
    
class Comment(models.Model):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    c_book = models.ForeignKey(PdfBook, on_delete=models.CASCADE)
    page_n = models.IntegerField()
    date_c = models.DateTimeField(default=datetime.now())
    

