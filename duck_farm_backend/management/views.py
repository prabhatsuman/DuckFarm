# management/views.py
from django.db.models import Sum,F
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import DuckInfo, Dealer, Expense, Stock, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection
from .serializers import (
    DuckInfoSerializer,
    DealerSerializer,
    ExpenseSerializer,
    RegisterSerializer,
    FeedStockSerializer,
    MedicineStockSerializer,
    OtherStockSerializer,
    EggStockSerializer,
    DailyEggCollectionSerializer,
    DuckBuySerializer

)
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not (username or email):
            return Response({'error': 'Username or email is required'}, status=400)

        user = None
        if username:
            user = authenticate(username=username, password=password)
        elif email:
            user = authenticate(email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)


class DuckInfoViewSet(viewsets.ModelViewSet):
    queryset = DuckInfo.objects.all()
    serializer_class = DuckInfoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='total', permission_classes=[IsAuthenticated])
    def total_ducks(self, request):
        total_male = DuckInfo.objects.aggregate(Sum('male_count'))['male_count__sum'] or 0
        total_female = DuckInfo.objects.aggregate(Sum('female_count'))['female_count__sum'] or 0
        total = total_male + total_female
        return Response({'total': total})

    def create(self, request, *args, **kwargs):
        serializer = DuckBuySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        breed = validated_data['breed']
        male_count = validated_data['male_count']
        female_count = validated_data['female_count']
        price_per_piece = validated_data['price_per_piece']
        dealer = validated_data['dealer']
        purchase_date = validated_data['purchase_date']

        try:
            # Check if the instance with the same breed exists
            duck_info = DuckInfo.objects.filter(breed=breed).first()

            if duck_info:
                # Update the existing instance by incrementing the counts
                duck_info.male_count = F('male_count') + male_count
                duck_info.female_count = F('female_count') + female_count
                duck_info.save()
                duck_info.refresh_from_db()
            else:
                # Create a new instance
                duck_info = DuckInfo.objects.create(
                    breed=breed,
                    male_count=male_count,
                    female_count=female_count
                )

            # Calculate amount for expenses
            amount = (male_count + female_count) * price_per_piece

            # Create expenses entry
            expense_data = {
                'description': f"Bought {male_count} male and {female_count} female ducks of breed {breed}",
                'date': purchase_date,
                'amount': amount,
                'exp_type': 'buy_duck',
                'dealer': dealer
            }
            Expense.objects.create(**expense_data)

            response_serializer = DuckInfoSerializer(duck_info)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class DealerViewSet(viewsets.ModelViewSet):
    queryset = Dealer.objects.all()
    serializer_class = DealerSerializer
    permission_classes = [IsAuthenticated]


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class FeedStockViewSet(viewsets.ModelViewSet):
    queryset = FeedStock.objects.all()
    serializer_class = FeedStockSerializer
    permission_classes = [IsAuthenticated]


class MedicineStockViewSet(viewsets.ModelViewSet):
    queryset = MedicineStock.objects.all()
    serializer_class = MedicineStockSerializer
    permission_classes = [IsAuthenticated]


class OtherStockViewSet(viewsets.ModelViewSet):
    queryset = OtherStock.objects.all()
    serializer_class = OtherStockSerializer
    permission_classes = [IsAuthenticated]


class DailyEggCollectionViewSet(viewsets.ModelViewSet):
    queryset = DailyEggCollection.objects.all()
    serializer_class = DailyEggCollectionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='total_stock', permission_classes=[IsAuthenticated])
    def total_stock(self, request):
        egg_stock, created = EggStock.objects.get_or_create(id=1)
        serializer = EggStockSerializer(egg_stock)
        return Response(serializer.data)
