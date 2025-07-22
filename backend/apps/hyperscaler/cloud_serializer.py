from rest_framework import serializers
from .models import  CloudCredential


class CloudCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudCredential
        fields = '__all__'

class CloudCredentialNameSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = CloudCredential
        fields = ['id', 'provider','cloud_id','name']
    def get_name(self, obj):
        return obj.account or obj.provider.upper()

class CloudCredentialPostSerialzer(serializers.ModelSerializer):
    class Meta:
        model = CloudCredential
        fields = [
            'provider',
            'account',
            'subscription_id',
            'tenant_id',
            'client_id',
            'client_secret',
            'arm_access_key',
            'region',
            'role'
        ]
        extra_kwargs = {
            'provider': {'required': True},
            'account': {'required': True}
        }
    def validate_provider(self, value):
        if value not in  ['aws', 'azure', 'gcp']:
            raise serializers.ValidationError("Invalid cloud provider. Supported providers are: aws, azure, gcp.")
        return value
