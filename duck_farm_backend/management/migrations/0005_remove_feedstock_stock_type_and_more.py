# Generated by Django 5.0.6 on 2024-06-14 18:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0004_feedstock_medicinestock_otherstock_delete_stock'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feedstock',
            name='stock_type',
        ),
        migrations.RemoveField(
            model_name='medicinestock',
            name='stock_type',
        ),
        migrations.RemoveField(
            model_name='otherstock',
            name='stock_type',
        ),
    ]
