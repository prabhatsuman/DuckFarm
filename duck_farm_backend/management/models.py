# management/models.py
from django.db import models
from django.utils import timezone


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
    breed = models.CharField(max_length=100, unique=True)
    male_count = models.IntegerField()
    female_count = models.IntegerField()

    def __str__(self):
        return f"{self.breed} - {self.dealer.name}"


class Expense(models.Model):
    EXPENSE_TYPES = [
        ('buy_duck', 'Buy Duck'),
        ('feed', 'Feed'),
        ('medicine', 'Medicine'),
        ('other_stocks', 'Other Stocks'),
        ('others', 'Others')
    ]

    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    exp_type = models.CharField(max_length=100, choices=EXPENSE_TYPES)
    dealer = models.ForeignKey(
        Dealer, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.get_exp_type_display()} - {self.amount}"


class Stock(models.Model):
    STOCK_TYPE_CHOICES = [
        ('feed', 'Feed'),
        ('medicine', 'Medicine'),
        ('other', 'Other'),
    ]

    description = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True


class FeedStock(Stock):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = models.DateField()

    def save(self, *args, **kwargs):
        # Fetch the CurrentFeed object or create it if it does not exist
        current_feed, created = CurrentFeed.objects.get_or_create(name=self.name)

        if not created: # If the CurrentFeed object already existed
            current_feed.quantity += self.quantity
        else:
            current_feed.quantity = self.quantity
        
        current_feed.save()
        super().save(*args, **kwargs)
        
    


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


class EggStock(models.Model):
    total_stock = models.IntegerField(default=0)


class DailyEggCollection(models.Model):
    date = models.DateField(default=timezone.now)
    quantity = models.IntegerField()

    class Meta:
        unique_together = ('date',)
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.pk:  # if this is a new object (not an update)
            egg_stock, created = EggStock.objects.get_or_create(id=1)
            egg_stock.total_stock += self.quantity
            egg_stock.save()
        super().save(*args, **kwargs)


class Sales(models.Model):
    date = models.DateField()
    dealer = models.ForeignKey(Dealer, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return f"{self.dealer} - {self.amount}"

class CurrentFeed(models.Model):
    name=models.CharField(max_length=100,unique=True)
    quantity = models.PositiveIntegerField(default=0) 
    
    def __str__(self):
        return self.name

    