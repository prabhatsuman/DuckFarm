# management/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DuckInfo, Dealer, Expense, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection, Sales
from datetime import datetime
from django.db import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        return user

class DealerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    dealer = DealerSerializer()

    class Meta:
        model = Expense
        fields = ['id', 'dealer', 'amount', 'date', 'exp_type', 'description']


class ExpenseAddSerializer(serializers.ModelSerializer):
    dealer = serializers.PrimaryKeyRelatedField(
        queryset=Dealer.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Expense
        fields = ['date', 'amount', 'description', 'exp_type', 'dealer']


class FeedStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedStock
        fields = '__all__'


class FeedBuySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    brand = serializers.CharField(max_length=100)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = serializers.DateField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    description = serializers.CharField(
        max_length=100, required=False, allow_blank=True)


class DuckInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DuckInfo
        fields = '__all__'


class DuckBuySerializer(serializers.Serializer):
    breed = serializers.CharField(max_length=100)
    male_count = serializers.IntegerField()
    female_count = serializers.IntegerField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    purchase_date = serializers.DateField()
    price_per_piece = serializers.DecimalField(max_digits=10, decimal_places=2)


class MedicineStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineStock
        fields = '__all__'


class MedicineBuySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    brand = serializers.CharField(max_length=100)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = serializers.DateField()
    date_of_expiry = serializers.DateField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    description = serializers.CharField(
        max_length=100, required=False, allow_blank=True)


class OtherStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherStock
        fields = '__all__'


class OtherBuySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    date_of_purchase = serializers.DateField()
    description = serializers.CharField(
        max_length=100, required=False, allow_blank=True)


class EggStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = EggStock
        fields = '__all__'


class DailyEggCollectionSerializer(serializers.ModelSerializer):
    date = serializers.DateField()

    def validate_date(self, value):
        if isinstance(value, datetime):
            return value.date()
        return value

    class Meta:
        model = DailyEggCollection
        fields = '__all__'


class DailyEggStockChartSerializer(serializers.Serializer):
    day = serializers.CharField(max_length=100)
    date = serializers.DateField()
    eggs = serializers.IntegerField()


class MonthlyEggStockChartSerializer(serializers.Serializer):
    year = serializers.CharField(max_length=100)
    month = serializers.CharField(max_length=100)
    eggs = serializers.IntegerField()
    
    
class SalesSerializer(serializers.ModelSerializer):
    dealer = DealerSerializer()

    class Meta:
        model = Sales
        fields = ['id', 'date', 'dealer', 'quantity', 'amount', 'description']
