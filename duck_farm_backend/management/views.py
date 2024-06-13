# management/views.py
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import DuckInfo, Dealer, Expanses, Stock
from .serializers import (
    DuckInfoSerializer,
    DealerSerializer,
    ExpansesSerializer,
    RegisterSerializer,
    StockSerializer
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

class DealerViewSet(viewsets.ModelViewSet):
    queryset = Dealer.objects.all()
    serializer_class = DealerSerializer
    permission_classes = [IsAuthenticated]

class ExpansesViewSet(viewsets.ModelViewSet):
    queryset = Expanses.objects.all()
    serializer_class = ExpansesSerializer
    permission_classes = [IsAuthenticated]

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]
