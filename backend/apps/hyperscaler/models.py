from django.db import models

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

    class Meta:
        db_table = 'cloud_credentials'

    def __str__(self):
        return f"{self.provider.upper()} Credentials"
