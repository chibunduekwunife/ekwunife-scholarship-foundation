from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os


class Command(BaseCommand):
    help = 'Check and fix admin user creation'

    def handle(self, *args, **options):
        # Get credentials from environment variables
        admin_username = os.environ.get('ADMIN_USERNAME', 'eksf#@2050')
        admin_password = os.environ.get('ADMIN_PASSWORD', '}}lcm2eksf1&*(30)')
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@ekwunife.org')
        
        self.stdout.write(f"Environment check:")
        self.stdout.write(f"ADMIN_USERNAME: {admin_username}")
        self.stdout.write(f"ADMIN_EMAIL: {admin_email}")
        self.stdout.write(f"ADMIN_PASSWORD: {'[set]' if admin_password else '[not set]'}")
        
        try:
            # Check if user exists
            try:
                user = User.objects.get(username=admin_username)
                self.stdout.write(f"User {admin_username} exists:")
                self.stdout.write(f"  - is_active: {user.is_active}")
                self.stdout.write(f"  - is_staff: {user.is_staff}")
                self.stdout.write(f"  - is_superuser: {user.is_superuser}")
                
                # Test password
                if user.check_password(admin_password):
                    self.stdout.write(self.style.SUCCESS("Password is correct"))
                else:
                    self.stdout.write(self.style.ERROR("Password is incorrect - fixing..."))
                    user.set_password(admin_password)
                    user.save()
                    self.stdout.write(self.style.SUCCESS("Password updated"))
                
            except User.DoesNotExist:
                self.stdout.write(f"User {admin_username} does not exist - creating...")
                
                # Delete any conflicting users
                User.objects.filter(username__in=['admin', admin_username]).delete()
                
                # Create new admin user
                user = User.objects.create_superuser(
                    username=admin_username,
                    email=admin_email,
                    password=admin_password
                )
                
                self.stdout.write(self.style.SUCCESS(f"Created admin user: {admin_username}"))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
            
        # List all users for debugging
        self.stdout.write("\nAll users in database:")
        for user in User.objects.all():
            self.stdout.write(f"  - {user.username} (staff: {user.is_staff}, superuser: {user.is_superuser})")
