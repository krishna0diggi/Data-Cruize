# from django.urls import path
# from .views import hyperscaler

# urlpatterns = [
#     path('', hyperscaler),
# ]

# apps/hyperscaler/urls.py
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import CloudCredentialViewSet

# router = DefaultRouter()
# router.register(r'credentials', CloudCredentialViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
# ]

# apps/hyperscaler/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CloudCredentialViewSet, GitCredentialsViewSet, EnvironmentViewSet

router = DefaultRouter()
router.register(r'cloud-credentials', CloudCredentialViewSet)
router.register(r'git-credentials', GitCredentialsViewSet)
router.register(r'environments', EnvironmentViewSet)
urlpatterns = [
    path('', include(router.urls)),
]

