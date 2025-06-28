#!/bin/bash

# Production Scholarship Setup Script
# This script sets up scholarships in the production database

set -e  # Exit on any error

echo "🚀 Setting up scholarships for production..."

# Navigate to the backend directory
cd "$(dirname "$0")/../backend"

echo "📋 Step 1: Applying database migrations..."
python manage.py migrate

echo "🎓 Step 2: Creating scholarships..."
python manage.py create_scholarships

echo "✅ Step 3: Verifying scholarships were created..."
python manage.py shell -c "
from api.models import Scholarship
scholarships = Scholarship.objects.all()
print(f'Total scholarships: {scholarships.count()}')
for s in scholarships:
    print(f'  - {s.name} (ID: {s.id})')
"

echo "🔗 Step 4: Testing API endpoint..."
echo "You can test the API at: /api/scholarships/"

echo "✨ Production scholarship setup complete!"
