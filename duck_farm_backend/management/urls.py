# management/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DuckInfoViewSet, DealerViewSet, ExpenseViewSet, RegisterView, LoginView, FeedStockViewSet, MedicineStockViewSet, OtherStockViewSet, DailyEggCollectionViewSet, SalesViewSet, ClearCacheView, EarningViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('duck_info', DuckInfoViewSet)
router.register('dealer_info', DealerViewSet)
router.register('expenses', ExpenseViewSet)
router.register('egg_stock', DailyEggCollectionViewSet)
router.register('sales', SalesViewSet)
router.register('earnings', EarningViewSet, basename='earnings')



stock_router = DefaultRouter()
stock_router.register('feed', FeedStockViewSet)
stock_router.register('medicine', MedicineStockViewSet)
stock_router.register('other', OtherStockViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('stocks/', include(stock_router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('clear_cache/',ClearCacheView.as_view(), name='clear_cache'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
