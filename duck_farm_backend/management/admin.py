from django.contrib import admin
from .models import DuckInfo, Dealer, Expanses, Stock

# Register your models here.
admin.site.register(DuckInfo)
admin.site.register(Dealer)
admin.site.register(Expanses)
admin.site.register(Stock)

