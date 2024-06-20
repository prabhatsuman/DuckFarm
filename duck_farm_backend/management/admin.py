from django.contrib import admin
from .models import DuckInfo, Dealer, Expense, Stock, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection, Sales

# Register your models here.
admin.site.register(DuckInfo)
admin.site.register(Dealer)
admin.site.register(Expense)
admin.site.register(FeedStock)
admin.site.register(MedicineStock)
admin.site.register(OtherStock)
admin.site.register(EggStock)
admin.site.register(DailyEggCollection)
admin.site.register(Sales)


