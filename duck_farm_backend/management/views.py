# management/views.py
from django.db.models import Sum, F
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import DuckInfo, Dealer, Expense, Stock, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection, Sales, CurrentFeed
from datetime import timedelta, date, datetime
from .utils import daterange
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from .pagination import DailyEggCollectionPagination, MonthlyEggCollectionPagination, SalesPagination, ExpensePagination, DailySalesPagination, MonthlySalesPagination, MonthlyExpensePagination, MonthlyEarningPagination
from .filters import SalesFilter, ExpenseFilter
from dateutil.relativedelta import relativedelta
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
    MonthlyEggStockChartSerializer,
    SalesSerializer,
    SalesAddSerializer,
    CurrentFeedSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
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
                'username': user.username,
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
                'description': f"Bought {male_count} male and {female_count} female ducks of breed {breed} at ₹{price_per_piece} per piece",
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
    queryset = Expense.objects.all().order_by('-date')
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ExpensePagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ExpenseFilter

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

    @action(detail=False, methods=['get'], url_path='dealer_list', permission_classes=[IsAuthenticated], serializer_class=DealerSerializer)
    def dealer_list(self, request):
        dealers = Dealer.objects.filter(expense__isnull=False).distinct()
        serializer = DealerSerializer(dealers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='expense_types', permission_classes=[IsAuthenticated])
    def expense_types(self, request):

        expense_types = Expense.objects.filter(
            exp_type__isnull=False).distinct()
        return Response(expense_types.values('exp_type').distinct())

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'], url_path='monthly_total_pages', permission_classes=[IsAuthenticated])
    def monthly_total_pages(self, request):
        queryset = self.queryset.order_by('date')
        first_year = queryset.first().date.year
        last_year = queryset.last().date.year
        total_years = last_year - first_year + 1
        cache.set('total_expense_years', total_years, timeout=60*60)
        return Response({'total_pages': total_years})
    @action(detail=False, methods=['get'], url_path='monthly_view', permission_classes=[IsAuthenticated])
    def monthly_view(self, request):
        page_number = int(request.query_params.get('page', 1))
        total_pages = cache.get('total_expense_years')
        page_number = total_pages - page_number + 1

        queryset = self.queryset.order_by('date')
        current_year = date.today().year
        target_year = current_year - page_number + 1
        start_month = date(target_year, 1, 1)
        end_month = date(target_year, 12, 31)
        data = []
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']

        for month in range(1, 13):
            total_expense = queryset.filter(date__year=target_year, date__month=month).aggregate(
                total_expense=Sum('amount'))['total_expense'] or 0
            data.append({
                'year': target_year,
                'month': months[month - 1],
                'total_expense': total_expense
            })

        result = {
            'month_range': {
                'start': f'January {target_year}',
                'end': f'December {target_year}'
            },
            'results': data
        }
        return Response(result)


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

            # Create expenses entry
            expense_data = {
                'description': f"Bought {quantity}kg of {name} feed of brand {brand} at ₹{price}",
                'date': date_of_purchase,
                'amount': price,
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

            # Create expenses entry
            expense_data = {
                'description': f"Bought {quantity}, {name} medicine of brand {brand} at ₹{price}",
                'date': date_of_purchase,
                'amount': price,
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

            # Create expenses entry
            expense_data = {
                'description': f"Bought {quantity} of {name} at ₹{price}",
                'date': date_of_purchase,
                'amount': price,
                'exp_type': 'other',
                'dealer': dealer
            }
            Expense.objects.create(**expense_data)

            response_serializer = OtherStockSerializer(other_stock)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

    @action(detail=False, methods=['get'], url_path='daily_total_pages', permission_classes=[IsAuthenticated])
    def daily_total_pages(self, request):
        queryset = self.queryset.order_by('date')
        first_date = queryset.first().date
        last_date = date.today()

        first_date -= timedelta(days=first_date.weekday())
        last_date += timedelta(days=(7 - last_date.weekday()))

        total_weeks = (last_date - first_date).days // 7
        cache.set('total_weeks', total_weeks, timeout=60*60)
        return Response({'total_pages': total_weeks})

    @action(detail=False, methods=['get'], url_path='daily_view', permission_classes=[IsAuthenticated])
    def daily_view(self, request):
        page_number = int(request.query_params.get('page', 1))
        total_pages = cache.get('total_weeks')
        page_number = total_pages-page_number+1

        current_sunday = date.today()-timedelta(days=date.today().weekday())
        start_date = current_sunday-timedelta(days=(page_number-1)*7)
        end_date = start_date+timedelta(days=6)

        queryset = self.queryset.filter(
            date__range=[start_date, end_date]).order_by('date')

        days = ['Sunday', 'Monday', 'Tuesday',
                'Wednesday', 'Thursday', 'Friday', 'Saturday']
        data = []

        for single_date in (start_date + timedelta(n) for n in range(7)):
            date_data = queryset.filter(date=single_date)
            eggs = date_data.aggregate(total_eggs=Sum('quantity'))[
                'total_eggs'] or 0
            data.append({
                'day': days[single_date.weekday()],
                'date': single_date,
                'eggs': eggs
            })
        result = {
            'date_range': {
                'start': start_date,
                'end': end_date
            },
            'results': data
        }
        return Response(result)

    @action(detail=False, methods=['get'], url_path='monthly_total_pages', permission_classes=[IsAuthenticated])
    def monthly_total_pages(self, request):
        queryset = self.queryset.order_by('date')
        first_year = queryset.first().date.year
        last_year = queryset.last().date.year
        total_years = last_year - first_year + 1
        cache.set('total_years', total_years, timeout=60*60)
        return Response({'total_pages': total_years})

    @action(detail=False, methods=['get'], url_path='monthly_view', permission_classes=[IsAuthenticated])
    def monthly_view(self, request):
        page_number = int(request.query_params.get('page', 1))
        total_pages = cache.get('total_years')
        page_number = total_pages-page_number+1

        queryset = self.queryset.order_by('date')
        current_year = date.today().year
        target_year = current_year - page_number + 1
        start_month = date(target_year, 1, 1)
        end_month = date(target_year, 12, 31)
        data = []
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']
        for month in range(1, 13):
            eggs = queryset.filter(date__year=target_year, date__month=month).aggregate(
                total_eggs=Sum('quantity'))['total_eggs'] or 0
            data.append({
                'month': months[month - 1],
                'year': target_year,
                'eggs': eggs})

        result = {
            'month_range': {
                'start': f'January {target_year}',
                'end': f'December {target_year}'
            },
            'results': data
        }
        return Response(result)


class SalesViewSet(viewsets.ModelViewSet):
    queryset = Sales.objects.all().order_by('-date')
    serializer_class = SalesSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SalesPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = SalesFilter
    ordering_fields = ['date', 'amount', 'quantity']

    def create(self, request, *args, **kwargs):
        serializer = SalesAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        date = validated_data['date']
        dealer = validated_data['dealer']
        quantity = validated_data['quantity']
        price_per_piece = validated_data['price']
        amount = quantity * price_per_piece

        try:
            sales = Sales.objects.create(
                date=date,
                dealer=dealer,
                quantity=quantity,
                amount=amount,
                description=f'Sold {quantity} eggs at ₹{price_per_piece} per piece'
            )
            egg_stock, created = EggStock.objects.get_or_create(id=1)
            egg_stock.total_stock -= quantity
            egg_stock.save()

            response_serializer = SalesSerializer(sales)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='dealer_list', permission_classes=[IsAuthenticated], serializer_class=DealerSerializer)
    def dealer_list(self, request):
        dealers = Dealer.objects.filter(sales__isnull=False).distinct()
        serializer = DealerSerializer(dealers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='daily_total_pages', permission_classes=[IsAuthenticated])
    def daily_total_pages(self, request):
        queryset = self.queryset.order_by('date')
        first_date = queryset.first().date
        last_date = date.today()

        first_date -= timedelta(days=first_date.weekday())
        last_date += timedelta(days=(7 - last_date.weekday()))

        total_weeks = (last_date - first_date).days // 7
        cache.set('total_sales_weeks', total_weeks, timeout=60*60)
        return Response({'total_pages': total_weeks})

    @action(detail=False, methods=['get'], url_path='daily_view', permission_classes=[IsAuthenticated])
    def daily_view(self, request):
        page_number = int(request.query_params.get('page', 1))
        total_pages = cache.get('total_sales_weeks')
        page_number = total_pages - page_number + 1

        current_sunday = date.today() - timedelta(days=date.today().weekday())
        start_date = current_sunday - timedelta(days=(page_number - 1) * 7)
        end_date = start_date + timedelta(days=6)

        queryset = self.queryset.filter(date__range=[start_date, end_date]).order_by('date')

        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        data = []

        for single_date in (start_date + timedelta(n) for n in range(7)):
            date_data = queryset.filter(date=single_date)
            sales = date_data.aggregate(total_sales=Sum('amount'))['total_sales'] or 0
            data.append({
                'day': days[single_date.weekday()],
                'date': single_date,
                'sales': sales
            })

        result = {
            'date_range': {
                'start': start_date,
                'end': end_date
            },
            'results': data
        }
        return Response(result)

    @action(detail=False, methods=['get'], url_path='monthly_total_pages', permission_classes=[IsAuthenticated])
    def monthly_total_pages(self, request):
        queryset = self.queryset.order_by('date')
        first_year = queryset.first().date.year
        last_year = queryset.last().date.year
        total_years = last_year - first_year + 1
        cache.set('total_sales_years', total_years, timeout=60*60)
        return Response({'total_pages': total_years})

    @action(detail=False, methods=['get'], url_path='monthly_view', permission_classes=[IsAuthenticated])
    def monthly_view(self, request):
        page_number = int(request.query_params.get('page', 1))
        total_pages = cache.get('total_sales_years')
        page_number = total_pages - page_number + 1

        queryset = self.queryset.order_by('date')
        current_year = date.today().year
        target_year = current_year - page_number + 1
        start_month = date(target_year, 1, 1)
        end_month = date(target_year, 12, 31)
        data = []
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']

        for month in range(1, 13):
            sales = queryset.filter(date__year=target_year, date__month=month).aggregate(
                total_sales=Sum('amount'))['total_sales'] or 0
            data.append({
                'month': months[month - 1],
                'year': target_year,
                'sales': sales
            })

        result = {
            'month_range': {
                'start': f'January {target_year}',
                'end': f'December {target_year}'
            },
            'results': data
        }
        return Response(result)

   

class EarningViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = MonthlyEarningPagination

    def list(self, request):
        cache_key = 'total_earning_data'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        else:
            total_expense = Expense.objects.aggregate(total_expense=Sum('amount'))[
                'total_expense'] or 0
            total_sales = Sales.objects.aggregate(total_sales=Sum('amount'))[
                'total_sales'] or 0
            total_earning = total_sales - total_expense
            return Response({'total_earning': total_earning, 'total_expense': total_expense, 'total_sales': total_sales})

    @action(detail=False, methods=['get'], url_path='this_month', permission_classes=[IsAuthenticated])
    def this_month(self, request):
        cache_key = 'total_earning_data'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        else:
            total_expense = Expense.objects.filter(date__month=date.today().month).aggregate(total_expense=Sum('amount'))[
                'total_expense'] or 0
            total_sales = Sales.objects.filter(date__month=date.today().month).aggregate(total_sales=Sum('amount'))[
                'total_sales'] or 0
            total_earning = total_sales - total_expense
            return Response({'total_earnings': total_earning})
        
    @action(detail=False, methods=['get'], url_path='monthly_total_pages', permission_classes=[IsAuthenticated])
    def monthly_total_pages(self, request):
        queryset = Sales.objects.order_by('date')
        first_year = queryset.first().date.year
        last_year = queryset.last().date.year
        total_years = last_year - first_year + 1
        cache.set('total_earning_years', total_years, timeout=60*60)
        return Response({'total_pages': total_years})

    @action(detail=False, methods=['get'], url_path='monthly_view', permission_classes=[IsAuthenticated])
    def monthly_view(self, request):
        page_number = int(request.query_params.get('page', 1))
        total_pages = cache.get('total_earning_years')
        page_number = total_pages - page_number + 1
        
        queryset = Sales.objects.order_by('date')
        current_year = date.today().year
        target_year = current_year - page_number + 1
        start_month = date(target_year, 1, 1)
        end_month = date(target_year, 12, 31)
        data = []
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']
        
        for month in range(1,13):
            total_sales = queryset.filter(date__year=target_year, date__month=month).aggregate(total_sales=Sum('amount'))['total_sales'] or 0
            total_expense = Expense.objects.filter(date__year=target_year, date__month=month).aggregate(total_expense=Sum('amount'))['total_expense'] or 0
            total_earning = total_sales - total_expense
            data.append({
                'month': months[month-1],
                'year': target_year,
                'total_sales': total_sales,
                'total_expense': total_expense,
                'total_earning': total_earning
            })
        result = {
            'month_range': {
                'start': f'January {target_year}',
                'end': f'December {target_year}'
            },
            'results': data
        }
        return Response(result)
    
         


class CurrentFeedViewSet(viewsets.ModelViewSet):
    queryset = CurrentFeed.objects.all()
    serializer_class = CurrentFeedSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, pk=None):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='total_stock', permission_classes=[IsAuthenticated])
    def total_stock(self, request):
        total_stock = CurrentFeed.objects.aggregate(
            total_stock=Sum('quantity'))['total_stock'] or 0
        return Response({'total_stock': total_stock})

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.quantity == 0:
            instance.delete()


class ClearCacheView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
       # clear cache for all views
        cache.delete('daily_egg_collection_data')
        cache.delete('monthly_egg_collection_data')
        cache.delete('daily_sales_data')
        cache.delete('monthly_sales_data')
        cache.delete('monthly_expense_data')
        cache.delete('total_earning_data')
        cache.delete('monthly_earning_data')
        return Response({'message': 'cache cleared'}, status=status.HTTP_200_OK)


class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    PERIOD_CHOICES = {
        'today': {
            'start_date': lambda: datetime.now().date(),
            'end_date': lambda: datetime.now().date(),
        },
        'this_week': {
            'start_date': lambda: datetime.now().date() - timedelta(days=datetime.now().weekday()),
            'end_date': lambda: datetime.now().date(),
        },
        'last_week': {
            'start_date': lambda: (datetime.now() - timedelta(days=datetime.now().weekday() + 7)).date(),
            'end_date': lambda: (datetime.now() - timedelta(days=datetime.now().weekday() + 1)).date(),
        },
        'this_month': {
            'start_date': lambda: datetime(datetime.now().year, datetime.now().month, 1).date(),
            'end_date': lambda: datetime(datetime.now().year, datetime.now().month, datetime.now().day).date(),
        },
        'last_month': {
            'start_date': lambda: (datetime(datetime.now().year, datetime.now().month, 1) - relativedelta(months=1)).date(),
            'end_date': lambda: (datetime(datetime.now().year, datetime.now().month, 1) - timedelta(days=1)).date(),
        },
        'last_3_months': {
            'start_date': lambda: (datetime(datetime.now().year, datetime.now().month, 1) - relativedelta(months=3)).date(),
            'end_date': lambda: datetime(datetime.now().year, datetime.now().month, datetime.now().day).date(),
        },
        'last_6_months': {
            'start_date': lambda: (datetime(datetime.now().year, datetime.now().month, 1) - relativedelta(months=6)).date(),
            'end_date': lambda: datetime(datetime.now().year, datetime.now().month, datetime.now().day).date(),
        },
    }

    mapping = {
        'today': 'today',
        'this_week': 'this week',
        'last_week': 'last week',
        'this_month': 'this month',
        'last_month': 'last month',
        'last_3_months': 'last 3 months',
        'last_6_months': 'last 6 months',
    }

    def get(self, request, selected_type, selected_period):
        if selected_type == 'sales':
            queryset = Sales.objects.all()
            if selected_period in self.PERIOD_CHOICES:
                start_date = self.PERIOD_CHOICES[selected_period]['start_date'](
                )
                end_date = self.PERIOD_CHOICES[selected_period]['end_date']()
                queryset = queryset.filter(date__range=[start_date, end_date])
                total_sales = queryset.aggregate(total_sales=Sum('amount'))[
                    'total_sales'] or 0
                return Response({'data': f'₹{total_sales} sales {self.mapping[selected_period]}'})

        elif selected_type == 'expenses':
            queryset = Expense.objects.all()
            if selected_period in self.PERIOD_CHOICES:
                start_date = self.PERIOD_CHOICES[selected_period]['start_date'](
                )
                end_date = self.PERIOD_CHOICES[selected_period]['end_date']()
                queryset = queryset.filter(date__range=[start_date, end_date])
                total_expense = queryset.aggregate(total_expense=Sum('amount'))[
                    'total_expense'] or 0
                return Response({'data': f'₹{total_expense} spent {self.mapping[selected_period]}'})

        elif selected_type == 'earning':
            sales_queryset = Sales.objects.all()
            expense_queryset = Expense.objects.all()
            if selected_period in self.PERIOD_CHOICES:
                start_date = self.PERIOD_CHOICES[selected_period]['start_date'](
                )
                end_date = self.PERIOD_CHOICES[selected_period]['end_date']()
                sales_queryset = sales_queryset.filter(
                    date__range=[start_date, end_date])
                expense_queryset = expense_queryset.filter(
                    date__range=[start_date, end_date])
                total_sales = sales_queryset.aggregate(total_sales=Sum('amount'))[
                    'total_sales'] or 0
                total_expense = expense_queryset.aggregate(total_expense=Sum('amount'))[
                    'total_expense'] or 0
                total_earning = total_sales - total_expense
                return Response({'data': f'₹{total_earning} earnt {self.mapping[selected_period]}'})

        elif selected_type == 'eggs_collected':
            queryset = DailyEggCollection.objects.all()
            if selected_period in self.PERIOD_CHOICES:
                start_date = self.PERIOD_CHOICES[selected_period]['start_date'](
                )
                end_date = self.PERIOD_CHOICES[selected_period]['end_date']()
                queryset = queryset.filter(date__range=[start_date, end_date])
                total_eggs = queryset.aggregate(total_eggs=Sum('quantity'))[
                    'total_eggs'] or 0
                return Response({'data': f'{total_eggs} eggs collected {self.mapping[selected_period]}'})

        elif selected_type == 'eggs_sold':
            queryset = Sales.objects.all()
            if selected_period in self.PERIOD_CHOICES:
                start_date = self.PERIOD_CHOICES[selected_period]['start_date'](
                )
                end_date = self.PERIOD_CHOICES[selected_period]['end_date']()
                queryset = queryset.filter(date__range=[start_date, end_date])
                total_eggs = queryset.aggregate(total_eggs=Sum('quantity'))[
                    'total_eggs'] or 0
                return Response({'data': f'{total_eggs} eggs sold {self.mapping[selected_period]}'})

        return Response({'error': 'Invalid type or period'}, status=400)
