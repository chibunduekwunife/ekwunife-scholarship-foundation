#!/bin/bash
# Quick setup script for existing Render deployment

echo "🔧 Setting up admin for existing deployment..."

# Run migrations (in case there are new ones)
python manage.py migrate

# Create/update admin user
python manage.py update_admin_credentials

echo "✅ Admin setup complete!"
echo "You can now access admin at: https://your-render-url.onrender.com/admin/"
echo "Username: eksf#@2050"
