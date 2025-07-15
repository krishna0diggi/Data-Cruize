# apps/hyperscaler/serializers.py
from rest_framework import serializers
from .models import CloudCredential

class CloudCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudCredential
        fields = '__all__'
