# duck_farm/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('management.urls')),  # Including the URLs from the management app
]
