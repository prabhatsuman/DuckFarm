# management/views.py
from django.db.models import Sum, F
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import DuckInfo, Dealer, Expense, Stock, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection
from datetime import timedelta, date, datetime
from .utils import daterange
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache

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
    DuckBuySerializer,
    FeedBuySerializer,
    MedicineBuySerializer,
    OtherBuySerializer,
    ExpenseAddSerializer,
    DailyEggStockChartSerializer,
    MonthlyEggStockChartSerializer
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
        total_male = DuckInfo.objects.aggregate(Sum('male_count'))[
            'male_count__sum'] or 0
        total_female = DuckInfo.objects.aggregate(Sum('female_count'))[
            'female_count__sum'] or 0
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
                'description': f"Bought {male_count} male and {female_count} female ducks of breed {breed} at {price_per_piece} per piece",
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

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return ExpenseAddSerializer
        return ExpenseSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Handle case where dealer may not be provided
        dealer = validated_data.get('dealer', None)
        amount = validated_data['amount']
        date = validated_data['date']
        exp_type = validated_data['exp_type']
        description = validated_data.get('description', None)

        try:
            # Create a new instance
            expense = Expense.objects.create(
                dealer=dealer,
                amount=amount,
                date=date,
                exp_type=exp_type,
                description=description
            )

            response_serializer = ExpenseSerializer(expense)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Handle case where dealer may not be provided
        dealer = validated_data.get('dealer', None)
        amount = validated_data['amount']
        date = validated_data['date']
        exp_type = validated_data['exp_type']
        description = validated_data.get('description', None)

        try:
            # Update the instance
            instance.dealer = dealer
            instance.amount = amount
            instance.date = date
            instance.exp_type = exp_type
            instance.description = description
            instance.save()

            response_serializer = ExpenseSerializer(instance)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FeedStockViewSet(viewsets.ModelViewSet):
    queryset = FeedStock.objects.all()
    serializer_class = FeedStockSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = FeedBuySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        name = validated_data['name']
        brand = validated_data['brand']
        quantity = validated_data['quantity']
        price = validated_data['price']
        date_of_purchase = validated_data['date_of_purchase']
        dealer = validated_data['dealer']
        description = validated_data['description']

        try:
            # Create a new instance
            feed_stock = FeedStock.objects.create(
                name=name,
                brand=brand,
                quantity=quantity,
                price=price,
                date_of_purchase=date_of_purchase,
                description=description
            )

            # Calculate amount for expenses
            amount = quantity * price

            # Create expenses entry
            expense_data = {
                'description': f"Bought {quantity}kg of {name} feed of brand {brand} at {price} per unit",
                'date': date_of_purchase,
                'amount': amount,
                'exp_type': 'feed',
                'dealer': dealer
            }
            Expense.objects.create(**expense_data)

            response_serializer = FeedStockSerializer(feed_stock)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MedicineStockViewSet(viewsets.ModelViewSet):
    queryset = MedicineStock.objects.all()
    serializer_class = MedicineStockSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = MedicineBuySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        name = validated_data['name']
        brand = validated_data['brand']
        quantity = validated_data['quantity']
        price = validated_data['price']
        date_of_purchase = validated_data['date_of_purchase']
        date_of_expiry = validated_data['date_of_expiry']
        dealer = validated_data['dealer']
        description = validated_data['description']

        try:
            # Create a new instance
            medicine_stock = MedicineStock.objects.create(
                name=name,
                brand=brand,
                quantity=quantity,
                price=price,
                date_of_purchase=date_of_purchase,
                date_of_expiry=date_of_expiry,
                description=description
            )

            # Calculate amount for expenses
            amount = quantity * price

            # Create expenses entry
            expense_data = {
                'description': f"Bought {quantity}, {name} medicine of brand {brand} at {price} per unit",
                'date': date_of_purchase,
                'amount': amount,
                'exp_type': 'medicine',
                'dealer': dealer
            }
            Expense.objects.create(**expense_data)

            response_serializer = MedicineStockSerializer(medicine_stock)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OtherStockViewSet(viewsets.ModelViewSet):
    queryset = OtherStock.objects.all()
    serializer_class = OtherStockSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = OtherBuySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        name = validated_data['name']
        price = validated_data['price']
        quantity = validated_data['quantity']
        date_of_purchase = validated_data['date_of_purchase']
        dealer = validated_data['dealer']
        description = validated_data['description']

        try:
            # Create a new instance
            other_stock = OtherStock.objects.create(
                name=name,
                price=price,
                quantity=quantity,
                date_of_purchase=date_of_purchase,
                description=description
            )

            # Calculate amount for expenses
            amount = quantity * price

            # Create expenses entry
            expense_data = {
                'description': f"Bought {quantity} {name} at {price} per unit",
                'date': date_of_purchase,
                'amount': amount,
                'exp_type': 'other',
                'dealer': dealer
            }
            Expense.objects.create(**expense_data)

            response_serializer = OtherStockSerializer(other_stock)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DailyEggCollectionPagination(PageNumberPagination):
    page_size = 7  # Number of items per page

    def paginate_queryset(self, data, request, view=None):
        self.page_size = self.get_page_size(request)
        return super().paginate_queryset(data, request, view)

    def get_paginated_response(self, data):
        page = self.page

        # Calculate start and end date for the current page
        start_date = data[0]['date'] if data else None
        end_date = data[-1]['date'] if data else None
        return Response({
            'count': (self.page.paginator.count+6)//7,
            # date range of the current page
            'page': page.number,
            'date_range': {
                'start': start_date,
                'end': end_date
            },
            'results': data,
            # date range per page

        })


class MonthlyEggCollectionPagination(PageNumberPagination):
    page_size = 12  # Number of items per page

    def paginate_queryset(self, data, request, view=None):
        self.page_size = self.get_page_size(request)
        return super().paginate_queryset(data, request, view)

    def get_paginated_response(self, data):
        page = self.page

        # Calculate start and end date for the current page
        start_month = data[0]['month'] if data else None
        start_year = data[0]['year'] if data else None
        end_month = data[-1]['month'] if data else None
        end_year = data[-1]['year'] if data else None
        return Response({
            'count': (self.page.paginator.count+11)//12,
            # date range of the current page
            'page': page.number,
            'month_range': {
                'start': start_month+" "+str(start_year),
                'end': end_month+" "+str(end_year)
            },
            'results': data,
            # date range per page

        })


class DailyEggCollectionViewSet(viewsets.ModelViewSet):
    queryset = DailyEggCollection.objects.all()
    serializer_class = DailyEggCollectionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DailyEggCollectionPagination

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by('date')  # Order queryset by 'date'
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='total_stock', permission_classes=[IsAuthenticated])
    def total_stock(self, request):
        egg_stock, created = EggStock.objects.get_or_create(id=1)
        serializer = EggStockSerializer(egg_stock)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def by_date(self, request):
        date_param = request.query_params.get('date')
        if date_param:
            queryset = DailyEggCollection.objects.filter(date=date_param)
            serializer = DailyEggCollectionSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            # Return empty list if no date parameter is provided
            return Response([])

    @action(detail=False, methods=['get'], url_path='daily_view', permission_classes=[IsAuthenticated])
    def daily_view(self, request):
        cache_key = 'daily_egg_collection_data'
        cached_data = cache.get(cache_key)

        if cached_data:
            data = cached_data
        else:
            queryset = self.queryset.order_by('date')
            first_date = queryset.first().date            
            last_date = date.today()
            

            first_date -= timedelta(days=first_date.weekday())
            last_date += timedelta(days=(6 - last_date.weekday()))

            data = []
            day_list = ['Monday', 'Tuesday', 'Wednesday',
                        'Thursday', 'Friday', 'Saturday', 'Sunday']
            for single_date in daterange(first_date, last_date):
                date_data = queryset.filter(date=single_date)
                eggs = date_data.first().quantity if date_data.exists() else 0
                data.append({
                    'day': day_list[single_date.weekday()],
                    'date': single_date,
                    'eggs': eggs
                })

            cache.set(cache_key, data, timeout=60*60)  # Cache for 1 hour

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, request)
        if page is not None:
            return paginator.get_paginated_response(page)

        return Response(data)

    @action(detail=False, methods=['get'], url_path='monthly_view', permission_classes=[IsAuthenticated])
    def monthly_view(self, request):

        cache_key = 'monthly_egg_collection_data'
        cached_data = cache.get(cache_key)
        if cached_data:
            data = cached_data
        else:
            queryset = self.queryset.order_by('date')
            first_year = queryset.first().date.year
            last_year = queryset.last().date.year
            months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
            data = []
            for year in range(first_year, last_year + 1):
                for month in range(1, 13):
                    eggs_collected = queryset.filter(date__year=year, date__month=month).aggregate(
                        total_eggs=Sum('quantity'))['total_eggs'] or 0

                    data.append({
                        'year': year,
                        'month': months[month - 1],
                        'eggs': eggs_collected
                    })
            cache.set(cache_key, data, timeout=60*60)

        paginator = MonthlyEggCollectionPagination()
        page = paginator.paginate_queryset(data, request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)
