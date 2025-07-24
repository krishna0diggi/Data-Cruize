from rest_framework import serializers
from .models import  Environment
from .cloud_serializer import CloudCredentialSerializer
from .git_serializer import GitCredentialsSerializer
from .models import CloudCredential, GitCredentials

class EnvironmentNameSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = Environment
        fields = '__all__'

class EnvironmentSerializer(serializers.ModelSerializer):
    cloud = CloudCredentialSerializer(read_only=True)
    git = GitCredentialsSerializer(read_only=True)

    # NEW: Allow setting cloud and git FKs by their DB ID
    cloud_id = serializers.PrimaryKeyRelatedField(
        queryset=CloudCredential.objects.all(), source='cloud', write_only=True, required=True
    )
    git_id = serializers.PrimaryKeyRelatedField(
        queryset=GitCredentials.objects.all(), source='git', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Environment
        fields = [
            'id',
            'env_id',
            'name',
            'description',
            'status',
            'cloud',        # nested read
            'git',          # nested read
            'cloud_id',     # for write
            'git_id',       # for write
            'created_at',
            'updated_at',
        ]
class EnvironmentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = ['name', 'description', 'cloud', 'git']

    def validate(self, data):
        if not data.get('cloud'):
            raise serializers.ValidationError("Cloud credential (ID) is required.")
        return data

class EnvironmentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = ['id', 'env_id', 'name', 'description', 'status','cloud', 'git', 'created_at', 'updated_at']

class EnvironmentNameIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = ['id', 'name', 'env_id']
