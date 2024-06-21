import django_filters
from .models import Sales, Expense


class SalesFilter(django_filters.FilterSet):
    searchTerm = django_filters.CharFilter(field_name='description', lookup_expr='icontains')
    startDate = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    endDate = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    minAmount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    maxAmount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    selectedDealer = django_filters.CharFilter(field_name='dealer__name', lookup_expr='exact')

    class Meta:
        model = Sales
        fields = ['searchTerm', 'startDate', 'endDate', 'minAmount', 'maxAmount', 'selectedDealer']
        
        
class ExpenseFilter(django_filters.FilterSet):
    searchTerm = django_filters.CharFilter(field_name='description', lookup_expr='icontains')
    startDate = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    endDate = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    minAmount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    maxAmount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    selectedDealer = django_filters.CharFilter(field_name='dealer__name', lookup_expr='exact')
    expenseType = django_filters.CharFilter(field_name='exp_type', lookup_expr='exact')

    class Meta:
        model = Expense
        fields = ['searchTerm', 'startDate', 'endDate', 'minAmount', 'maxAmount', 'selectedDealer', 'expenseType']