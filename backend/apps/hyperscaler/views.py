# apps/hyperscaler/views.pys
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q
from .workflow.runenv import process_environment_payload
from rest_framework.response import Response
from .models import CloudCredential, GitCredentials, Environment
# from .serializers import CloudCredentialSerializer, GitCredentialsSerializer, EnvironmentSerializer, GitCredentialNameSerializer
from .cloud_serializer import CloudCredentialNameSerializer,CloudCredentialSerializer
from .git_serializer import GitCredentialNameSerializer,GitCredentialsSerializer
from .env_serializer import EnvironmentNameSerializer,EnvironmentSerializer,  EnvironmentSerializer,EnvironmentPostSerializer,EnvironmentBasicSerializer, EnvironmentNameIdSerializer


class CloudCredentialViewSet(viewsets.ModelViewSet):
    """
    Full CRUD + custom GET endpoints for cloud credentials
    """
    queryset = CloudCredential.objects.all()
    serializer_class = CloudCredentialSerializer

    def get_serializer_class(self):
        if self.action == 'get_name_id':
            return CloudCredentialNameSerializer
        return CloudCredentialSerializer

    # Custom GET: /cloud-credentials/getall/
    @action(detail=False, methods=['get'], url_path='getall')
    def get_all_cloud_credentials(self, request):
        cloud_credentials = self.get_queryset()
        serializer = self.get_serializer(cloud_credentials, many=True)
        return Response(serializer.data)

    # Custom GET: /cloud-credentials/get-id/
    @action(detail=False, methods=['get'], url_path='get-id')
    def get_name_id(self, request):
        cloud_credentials = self.get_queryset()
        serializer = self.get_serializer(cloud_credentials, many=True)
        return Response(serializer.data)
       
class GitCredentialsViewSet(viewsets.ModelViewSet):
    queryset = GitCredentials.objects.all()
    serializer_class = GitCredentialsSerializer

    def get_serializer_class(self):
        if self.action =='get_name_id':
            return GitCredentialNameSerializer
        return GitCredentialsSerializer

      # Custom GET all (full): /git-credentials/getall/
    @action(detail=False, methods=['get'], url_path='getall')
    def get_all_git_credentials(self, request):
        git_credentials = self.get_queryset()
        serializer = self.get_serializer(git_credentials, many=True)
        return Response(serializer.data)

    # Custom GET name & id only: /git-credentials/get-id/
    @action(detail=False, methods=['get'], url_path='get-id')
    def get_name_id(self, request):
        git_credentials = self.get_queryset()
        serializer = self.get_serializer(git_credentials, many=True)
        return Response(serializer.data)

class EnvironmentViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD and custom endpoints for Environment
    """
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer

    def get_serializer_class(self):
        # Dynamically choose per custom action / route
        if self.action == 'get_name_id':
            return EnvironmentNameIdSerializer
        elif self.action == 'create_env':
            return EnvironmentPostSerializer
        elif self.action == 'get_all_nested_false':
            return EnvironmentBasicSerializer
        elif self.action == 'create':
            return EnvironmentPostSerializer
        return EnvironmentSerializer

    # GET: /environments/getall/ → full nested
    @action(detail=False, methods=['get'], url_path='getall')
    def getall(self, request):
        envs = self.get_queryset()
        serializer = self.get_serializer(envs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # GET: /environments/get-all-nested-false/ → no nested
    @action(detail=False, methods=['get'], url_path='get-all-nested-false')
    def get_all_nested_false(self, request):
        envs = self.get_queryset()
        serializer = self.get_serializer(envs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # GET: /environments/get-name-id/
    @action(detail=False, methods=['get'], url_path='get-name-id')
    def get_name_id(self, request):
        envs = self.get_queryset()
        serializer = self.get_serializer(envs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: /environments/create/
    @action(detail=False, methods=['post'], url_path='create')
    def create_env(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response({
                "message": "Environment created successfully",
                "env_id": instance.env_id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

    
    # POST: /environment/run
    @action(detail=False, methods=['post'], url_path='run')
    def run_environment(self,request):
        data = request.data
        print(data)
        env_id = data.get('env')
        cloud_id = data.get('cloud')
        git_id = data.get('git')

        try:
            env = Environment.objects.get(id=env_id)
        except Environment.DoesNotExist:
            Response({"error": f"Environment with id {env_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
             cloud = CloudCredential.objects.get(id=cloud_id)
        except:
            cloud = None

        try:
            git = GitCredentials.objects.get(id=git_id)
        except GitCredentials.DoesNotExist:
            git = None
        payload = {
                "env": env,
                "cloud": cloud,
                "git": git
        }
        
        result = process_environment_payload(payload)
        print("View for environment",result)
        return Response(result, status= status.HTTP_200_OK)


