from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import Sum



class DailyEggCollectionPagination(PageNumberPagination):
    page_size = 7  # Number of items per page

    def paginate_queryset(self, data, request, view=None):
        self.page_size = self.get_page_size(request)
        return super().paginate_queryset(data, request, view)

    def get_paginated_response(self, data):
        page = self.page

        # Calculate start and end date for the current page
        start_date = data[0]['date'] if data else None
        end_date = data[-1]['date'] if data else None
        return Response({
            'count': (self.page.paginator.count+6)//7,
            # date range of the current page
            'page': page.number,
            'date_range': {
                'start': start_date,
                'end': end_date
            },
            'results': data,
            # date range per page

        })


class MonthlyEggCollectionPagination(PageNumberPagination):
    page_size = 12  # Number of items per page

    def paginate_queryset(self, data, request, view=None):
        self.page_size = self.get_page_size(request)
        return super().paginate_queryset(data, request, view)

    def get_paginated_response(self, data):
        page = self.page

        # Calculate start and end date for the current page
        start_month = data[0]['month'] if data else None
        start_year = data[0]['year'] if data else None
        end_month = data[-1]['month'] if data else None
        end_year = data[-1]['year'] if data else None
        return Response({
            'count': (self.page.paginator.count+11)//12,
            # date range of the current page
            'page': page.number,
            'month_range': {
                'start': start_month+" "+str(start_year),
                'end': end_month+" "+str(end_year)
            },
            'results': data,
            # date range per page

        })


class SalesPagination(PageNumberPagination):
    page_size= 10
    
    def paginate_queryset(self,queryset,request,view=None):
        self.total_amount = queryset.aggregate(total_amount=Sum('amount'))['total_amount'] or 0
        return super().paginate_queryset(queryset,request,view)
    
    def get_paginated_response(self,data):
       return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'total_amount': self.total_amount,
            'results': data,
        })
       
       
class ExpensePagination(PageNumberPagination):
    page_size = 10

    def paginate_queryset(self, queryset, request, view=None):
        self.total_amount = queryset.aggregate(total_amount=Sum('amount'))['total_amount'] or 0
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'total_amount': self.total_amount,
            'results': data,
        })