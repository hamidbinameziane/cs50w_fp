# Generated by Django 5.0.1 on 2024-01-26 15:03

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('read', '0007_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='date_c',
            field=models.DateTimeField(default=datetime.datetime(2024, 1, 26, 15, 3, 0, 34592)),
        ),
    ]
