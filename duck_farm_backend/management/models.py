# management/models.py
from django.db import models

class Dealer(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    dealer_type = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class DuckInfo(models.Model):
    breed = models.CharField(max_length=100,unique=True)
    male_count = models.IntegerField()
    female_count = models.IntegerField()  

    def __str__(self):
        return f"{self.breed} - {self.dealer.name}"
    

class Expanses(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    exp_type = models.CharField(max_length=100)
    dealer = models.ForeignKey(Dealer, related_name='expanses', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.type} - {self.amount}"

class Stock(models.Model):
    STOCK_TYPE_CHOICES = [
        ('feed', 'Feed'),
        ('medicine', 'Medicine'),
        ('other', 'Other'),
    ]
    stock_type = models.CharField(max_length=10, choices=STOCK_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True

class FeedStock(Stock):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = models.DateField()

class MedicineStock(Stock):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = models.DateField()
    date_of_expiry = models.DateField()

class OtherStock(Stock):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    date_of_purchase = models.DateField()