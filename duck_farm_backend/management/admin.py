from django.contrib import admin
from .models import DuckInfo, Dealer, Expense, Stock

# Register your models here.
admin.site.register(DuckInfo)
admin.site.register(Dealer)
admin.site.register(Expense)


