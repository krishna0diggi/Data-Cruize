# Generated by Django 5.2.3 on 2025-07-24 06:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hyperscaler', '0005_cloudcredential_unique_name_alter_environment_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='gitcredentials',
            name='unique_Name',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='environment',
            name='status',
            field=models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('pending', 'Pending'), ('failed', 'Failed'), ('deleting', 'Deleting'), ('deleted', 'Deleted'), ('suspended', 'Suspended'), ('resuming', 'Resuming'), ('resumed', 'Resumed'), ('creating', 'Creating'), ('updating', 'Updating'), ('inactive', 'Inactive'), ('error', 'Error'), ('cancelling', 'Cancelling'), ('cancelled', 'Cancelled'), ('suspending', 'Suspending'), ('succeeded', 'Succeeded'), ('archived', 'Archived')], default='inactive', max_length=20),
        ),
    ]
