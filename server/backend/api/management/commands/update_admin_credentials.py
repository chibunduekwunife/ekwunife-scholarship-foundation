from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os


class Command(BaseCommand):
    help = 'Update admin credentials for production using environment variables'

    def handle(self, *args, **options):
        # Get credentials from environment variables
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@ekwunife.org')
        
        try:
            # Delete existing admin users
            User.objects.filter(username__in=['admin', admin_username]).delete()
            
            # Create new admin user with secure credentials
            admin_user = User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password
            )
            
            self.stdout.write(
                self.style.SUCCESS('Successfully created admin user with environment credentials')
            )
            self.stdout.write(f'Admin username: {admin_user.username}')
            self.stdout.write(f'Admin email: {admin_user.email}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating admin user: {str(e)}')
            )
