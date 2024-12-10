from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.conf import settings
# Create your models here.
class BaseUserManager(BaseUserManager):
    def create_user(self,email,first_name,last_name,farm_name,password=None):
        if not email:
            raise ValueError('User must have an email address')
        if not first_name:
            raise ValueError('User must have a first name')
        if not last_name:
            raise ValueError('User must have a last name')
        if not farm_name:
            raise ValueError('User must have a farm name')
        
        user=self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            farm_name=farm_name
        )
        
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,first_name,last_name,farm_name,password=None):
        user=self.create_user(
            email,
            first_name,
            last_name,
            farm_name,
            password=password
        )
        user.is_admin=True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email=models.EmailField(unique=True)
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100)
    is_active=models.BooleanField(default=True)
    farm_name=models.CharField(max_length=100)
    date_joined=models.DateTimeField(auto_now_add=True)
    is_admin=models.BooleanField(default=False)
    
    objects=BaseUserManager()
    
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['first_name','last_name','farm_name']
    
    def __str__(self):
        return self.email
    




class UserOwnedModel(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Dealer(UserOwnedModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    dealer_type = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class DuckInfo(UserOwnedModel):
    breed = models.CharField(max_length=100, unique=True)
    male_count = models.IntegerField()
    female_count = models.IntegerField()

    def __str__(self):
        return f"{self.breed} - {self.user.username}"


class Expense(UserOwnedModel):
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


class FeedStock(UserOwnedModel, Stock):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = models.DateField()

    def save(self, *args, **kwargs):
        # Ensure the current feed is updated or created for the current user
        current_feed, created = CurrentFeed.objects.get_or_create(
            name=self.name, user=self.user  # Filter by both name and current user
        )
        if not created:
            current_feed.quantity += self.quantity  # Update existing quantity
        else:
            current_feed.quantity = self.quantity  # Set initial quantity if created
        current_feed.save()
        super().save(*args, **kwargs)



class MedicineStock(UserOwnedModel, Stock):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = models.DateField()
    date_of_expiry = models.DateField()


class OtherStock(UserOwnedModel, Stock):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    date_of_purchase = models.DateField()
class EggStock(UserOwnedModel):
    total_stock = models.IntegerField(default=0)
    

class DailyEggCollection(UserOwnedModel):
    date = models.DateField(default=timezone.now)
    quantity = models.IntegerField()

    class Meta:
        unique_together = ('date', 'user')  # Make the date unique per user
        ordering = ['-date']

    def save(self, *args, **kwargs):
        if not self.pk:
            egg_stock, created = EggStock.objects.get_or_create(user=self.user)
            egg_stock.total_stock += self.quantity
            egg_stock.save()
        super().save(*args, **kwargs)


class Sales(UserOwnedModel):
    date = models.DateField()
    dealer = models.ForeignKey(Dealer, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return f"{self.dealer} - {self.amount}"


class CurrentFeed(UserOwnedModel):
    name = models.CharField(max_length=100, unique=True)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
