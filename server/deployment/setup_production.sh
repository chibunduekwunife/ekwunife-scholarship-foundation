#!/bin/bash
# Production Setup Script for Ekwunife Scholarship Foundation

echo "🚀 Setting up production environment..."

# Check if running in production environment
if [ "$DEBUG" = "False" ] || [ "$ENVIRONMENT" = "production" ]; then
    echo "✅ Production environment detected"
    
    # Run database migrations
    echo "📦 Running database migrations..."
    python manage.py migrate
    
    # Create admin user
    echo "👤 Creating admin user..."
    python manage.py update_admin_credentials
    
    # Collect static files
    echo "📁 Collecting static files..."
    python manage.py collectstatic --noinput
    
    # Create sample scholarships
    echo "🎓 Creating sample scholarships..."
    python create_scholarships.py
    
    echo "✅ Production setup complete!"
    echo "Admin credentials:"
    echo "Username: $ADMIN_USERNAME"
    echo "Password: [Check environment variables]"
    
else
    echo "⚠️  This script is for production only"
    echo "Current DEBUG setting: $DEBUG"
fi
