#!/bin/bash
# Quick test script to verify admin user creation locally

echo "🔍 Testing admin user creation locally..."

# Set environment variables for testing
export ADMIN_USERNAME="eksf#@2050"
export ADMIN_PASSWORD="}}lcm2eksf1&*(30)"
export ADMIN_EMAIL="admin@ekwunife.org"

echo "Running check_admin command..."
python manage.py check_admin

echo ""
echo "Testing login with Django shell..."
python manage.py shell -c "
from django.contrib.auth import authenticate
user = authenticate(username='eksf#@2050', password='}}lcm2eksf1&*(30)')
if user:
    print('✅ Authentication successful')
    print(f'User: {user.username}')
    print(f'Staff: {user.is_staff}')
    print(f'Superuser: {user.is_superuser}')
else:
    print('❌ Authentication failed')
"
