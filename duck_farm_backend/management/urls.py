# management/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DuckInfoViewSet, DealerViewSet, ExpenseViewSet, RegisterView, LoginView, FeedStockViewSet, MedicineStockViewSet, OtherStockViewSet, DailyEggCollectionViewSet, SalesViewSet, ClearCacheView, EarningViewSet, ChatbotView, CurrentFeedViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView

router = DefaultRouter()
router.register('duck_info', DuckInfoViewSet,basename='duck_info')
router.register('dealer_info', DealerViewSet, basename='dealer_info')
router.register('expenses', ExpenseViewSet, basename='expenses')
router.register('egg_stock', DailyEggCollectionViewSet, basename='egg_stock')
router.register('sales', SalesViewSet, basename='sales')
router.register('earnings', EarningViewSet, basename='earnings')
router.register('current_feed', CurrentFeedViewSet, basename='current_feed')



stock_router = DefaultRouter()
stock_router.register('feed', FeedStockViewSet, basename='feed')
stock_router.register('medicine', MedicineStockViewSet, basename='medicine')
stock_router.register('other', OtherStockViewSet, basename='other')


urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('stocks/', include(stock_router.urls)),   
    path('token/blacklist/',TokenBlacklistView.as_view(), name='token_blacklist'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('clear_cache/',ClearCacheView.as_view(), name='clear_cache'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('chatbot/<str:selected_type>/<str:selected_period>/',ChatbotView.as_view(), name='chatbot'),
]
