# Generated by Django 5.0.1 on 2024-01-24 22:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('read', '0002_pdfbook_delete_dangobook'),
    ]

    operations = [
        migrations.AddField(
            model_name='pdfbook',
            name='description',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='pdfbook',
            name='book',
            field=models.FileField(upload_to='pdf/'),
        ),
    ]