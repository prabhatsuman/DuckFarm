# management/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DuckInfoViewSet, DealerViewSet, ExpansesViewSet, RegisterView, LoginView, FeedStockViewSet, MedicineStockViewSet, OtherStockViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('duck_info', DuckInfoViewSet)
router.register('dealer_info', DealerViewSet)
router.register('expanses_info', ExpansesViewSet)
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
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
