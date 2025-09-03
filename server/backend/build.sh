#!/bin/bash
# Render.com build script for Django backend

set -o errexit  # exit on error

echo "🚀 Starting Render deployment..."

# Install dependencies
pip install -r requirements.txt

# Run database migrations
echo "📦 Running migrations..."
python manage.py migrate

# Create admin user
echo "👤 Creating admin user..."
python manage.py update_admin_credentials

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Create sample scholarships (if needed)
echo "🎓 Setting up sample data..."
python create_scholarships.py

echo "✅ Render deployment complete!"
