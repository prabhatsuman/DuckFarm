from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User, DuckInfo, Dealer, Expense, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection, Sales, CurrentFeed
from datetime import datetime
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'farm_name']       


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'farm_name', 'password', 'confirm_password']

    def validate(self, attrs):   
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):      
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            farm_name=validated_data['farm_name'],
            password=validated_data['password']
        )
        return user


class DealerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Dealer
        fields = ['id', 'name', 'description', 'address', 'email', 'phone_number', 'dealer_type', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ExpenseSerializer(serializers.ModelSerializer):
    dealer = DealerSerializer()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'user', 'dealer', 'amount', 'date', 'exp_type', 'description']


class ExpenseAddSerializer(serializers.ModelSerializer):
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Expense
        fields = ['date', 'amount', 'description', 'exp_type', 'dealer']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class FeedStockSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = FeedStock
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class FeedBuySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    brand = serializers.CharField(max_length=100)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = serializers.DateField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    description = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DuckInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DuckInfo
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DuckBuySerializer(serializers.Serializer):
    breed = serializers.CharField(max_length=100)
    male_count = serializers.IntegerField()
    female_count = serializers.IntegerField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    purchase_date = serializers.DateField()
    price_per_piece = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class MedicineStockSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MedicineStock
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class MedicineBuySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    brand = serializers.CharField(max_length=100)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    date_of_purchase = serializers.DateField()
    date_of_expiry = serializers.DateField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    description = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class OtherStockSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = OtherStock
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class OtherBuySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    date_of_purchase = serializers.DateField()
    description = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EggStockSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EggStock
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DailyEggCollectionSerializer(serializers.ModelSerializer):
    date = serializers.DateField()
    user = UserSerializer(read_only=True)

    def validate_date(self, value):
        if isinstance(value, datetime):
            return value.date()
        return value

    class Meta:
        model = DailyEggCollection
        fields = ['date', 'quantity', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


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
    user = UserSerializer(read_only=True)

    class Meta:
        model = Sales
        fields = ['id', 'date', 'dealer', 'quantity', 'amount', 'description', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SalesAddSerializer(serializers.Serializer):
    dealer = serializers.PrimaryKeyRelatedField(queryset=Dealer.objects.all())
    quantity = serializers.IntegerField()
    date = serializers.DateField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CurrentFeedSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CurrentFeed
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
