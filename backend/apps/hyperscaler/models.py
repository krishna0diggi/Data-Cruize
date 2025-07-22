from django.db import models
from .utils import generate_custom_id

class CloudCredential(models.Model):
    PROVIDER_CHOICES = [
        ('aws', 'Amazon Web Services'),
        ('azure', 'Microsoft Azure'),
        ('gcp', 'Google Cloud Platform'),
        # Add more in the future
    ]

    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Common fields
    account = models.CharField(max_length=100, blank=True, null=True)
    subscription_id = models.CharField(max_length=100, blank=True, null=True)
    tenant_id = models.CharField(max_length=100, blank=True, null=True)
    client_id = models.CharField(max_length=100, blank=True, null=True)
    client_secret = models.CharField(max_length=255, blank=True, null=True)
    arm_access_key = models.CharField(max_length=255, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    cloud_id = models.CharField(
        max_length=10,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'cloud_credentials'

    def save(self, *args, **kwargs):
        if not self.cloud_id:
            self.cloud_id = generate_custom_id('CL')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.provider.upper()} Credentials"

class GitCredentials(models.Model):
    github_token = models.CharField(max_length=255)
    repo_owner = models.CharField(max_length=255)
    repo_name = models.CharField(max_length=255)
    workflow_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    git_id = models.CharField(
        max_length=10,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'git_credentials'

    def save(self, *args, **kwargs):
        if not self.git_id:
            self.git_id = generate_custom_id('GT')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.repo_owner}/{self.repo_name}"

class Environment(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    cloud = models.ForeignKey(CloudCredential, on_delete=models.CASCADE, related_name='environments', null=True)
    git = models.ForeignKey(GitCredentials, on_delete=models.CASCADE, related_name='environments', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    env_id = models.CharField(
        max_length=10,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'environments'
    
    def save(self, *args, **kwargs):
        if not self.env_id:
            self.env_id = generate_custom_id('EV')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name