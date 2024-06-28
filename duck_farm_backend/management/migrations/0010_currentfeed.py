# Generated by Django 5.0.6 on 2024-06-28 09:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0009_sales'),
    ]

    operations = [
        migrations.CreateModel(
            name='CurrentFeed',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('quantity', models.PositiveIntegerField()),
            ],
        ),
    ]
