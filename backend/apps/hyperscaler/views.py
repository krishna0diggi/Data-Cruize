# apps/hyperscaler/views.py
from rest_framework import viewsets
from .models import CloudCredential
from .serializers import CloudCredentialSerializer

class CloudCredentialViewSet(viewsets.ModelViewSet):
    queryset = CloudCredential.objects.all()
    serializer_class = CloudCredentialSerializer
