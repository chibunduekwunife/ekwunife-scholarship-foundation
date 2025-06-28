#!/bin/bash

# Quick Production Deployment Script
# This script handles the complete deployment process including scholarships

set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this script from the Django project root."
    exit 1
fi

echo "📦 Step 1: Installing/updating dependencies..."
pip install -r requirements.txt

echo "📋 Step 2: Collecting static files..."
python manage.py collectstatic --noinput

echo "🗄️ Step 3: Running database migrations..."
python manage.py migrate

echo "🎓 Step 4: Setting up scholarships..."
python manage.py create_scholarships

echo "✅ Step 5: Verifying setup..."
echo "Checking scholarships..."
python manage.py shell -c "
from api.models import Scholarship
count = Scholarship.objects.count()
print(f'✓ Found {count} scholarships in database')
if count == 0:
    print('⚠️  Warning: No scholarships found!')
    exit(1)
"

echo "🧪 Step 6: Running basic tests..."
python manage.py check

echo "✨ Production deployment complete!"
echo ""
echo "📋 Summary:"
echo "  - Dependencies installed"
echo "  - Static files collected"
echo "  - Database migrations applied"
echo "  - Scholarships created"
echo "  - Basic checks passed"
echo ""
echo "🔗 You can now test the scholarships API at: /api/scholarships/"
