# management/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DuckInfoViewSet, DealerViewSet, ExpansesViewSet, RegisterView, LoginView, StockViewSet

router = DefaultRouter()
router.register('duck_info', DuckInfoViewSet)
router.register('dealer_info', DealerViewSet)
router.register('expanses_info', ExpansesViewSet)
router.register('stocks', StockViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
