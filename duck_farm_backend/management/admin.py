from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, DuckInfo, Dealer, Expense, Stock, FeedStock, MedicineStock, OtherStock, EggStock, DailyEggCollection, Sales


class UserAdmin(UserAdmin):
    # The fields to be used in displaying the User model.
    list_display = ('email', 'first_name', 'last_name', 'farm_name', 'is_admin', 'is_active')
    list_filter = ('is_admin', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Information', {'fields': ('first_name', 'last_name', 'farm_name')}),
        ('Permissions', {'fields': ('is_admin', 'is_active')}),
        ('Important Dates', {'fields': ('date_joined',)}),
    )
    # Fields to be used when adding a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'farm_name', 'password1', 'password2', 'is_active')}
        ),
    )
    search_fields = ('email', 'first_name', 'last_name', 'farm_name')
    ordering = ('email',)
    filter_horizontal = ()

# Register the custom user model and the custom admin
admin.site.register(User, UserAdmin)

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


