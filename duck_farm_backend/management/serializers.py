# management/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DuckInfo, Dealer, Expanses, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection
from datetime import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class DuckInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DuckInfo
        fields = '__all__'


class DealerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = '__all__'


class ExpansesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expanses
        fields = '__all__'


class FeedStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedStock
        fields = '__all__'


class MedicineStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineStock
        fields = '__all__'


class OtherStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherStock
        fields = '__all__'


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
