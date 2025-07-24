from rest_framework import serializers
from .models import  GitCredentials

class GitCredentialNameSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = GitCredentials
        fields = ['id','git_id','name','unique_Name']
    def get_name(self, obj):
        return f"{obj.repo_owner}/{obj.repo_name}"

class GitCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GitCredentials
        fields = '__all__'
