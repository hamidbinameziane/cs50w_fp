from django.db import models

class DangoBook(models.Model):
    page = models.IntegerField()
    body = models.CharField(max_length=100000)
