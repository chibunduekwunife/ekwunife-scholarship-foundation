#!/bin/bash
# Render.com build script for Django backend

set -o errexit  # exit on error

echo "🚀 Starting Render deployment..."

# Install dependencies
pip install -r requirements.txt

# Run database migrations
echo "📦 Running migrations..."
python manage.py migrate

# Collect static files FIRST (needed for admin styling)
echo "� Collecting static files..."
python manage.py collectstatic --noinput

# Create admin user with debug info
echo "👤 Creating admin user..."
echo "Environment check:"
echo "ADMIN_USERNAME: ${ADMIN_USERNAME:-'not set'}"
echo "ADMIN_EMAIL: ${ADMIN_EMAIL:-'not set'}"
if [ -n "$ADMIN_PASSWORD" ]; then
    echo "ADMIN_PASSWORD: [set]"
else
    echo "ADMIN_PASSWORD: [not set]"
fi

python manage.py update_admin_credentials

# Create sample scholarships (if needed)
echo "🎓 Setting up sample data..."
python create_scholarships.py

echo "✅ Render deployment complete!"
