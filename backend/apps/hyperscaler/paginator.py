# pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPaginator(PageNumberPagination):
    page_size_query_param = 'pageSize'
    page_query_param = 'pageIndex'

    def get_paginated_response(self, data):
        return Response({
            'result': data,
            'paginator': {
                'pageIndex': self.page.number,
                'pageSize': self.get_page_size(self.request),
                'totalData': self.page.paginator.count
            }
        })
