# Generated by Django 5.0.6 on 2024-06-28 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0010_currentfeed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='currentfeed',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
