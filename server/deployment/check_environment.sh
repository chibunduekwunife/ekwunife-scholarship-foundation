#!/bin/bash

# Environment Check Script
# Verifies that the production environment is ready for scholarship setup

echo "🔍 Checking production environment..."

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run from Django project root."
    exit 1
fi

echo "✅ Found Django project"

# Check if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "✅ Found requirements.txt"
else
    echo "⚠️  Warning: requirements.txt not found"
fi

# Check Python version
echo "🐍 Python version: $(python --version)"

# Check Django
echo "🔧 Checking Django installation..."
python -c "import django; print(f'Django version: {django.get_version()}')" 2>/dev/null || {
    echo "❌ Django not installed or not accessible"
    exit 1
}

# Check if database is accessible
echo "🗄️  Checking database connection..."
python manage.py check --database default 2>/dev/null && {
    echo "✅ Database connection OK"
} || {
    echo "❌ Database connection failed"
    exit 1
}

# Check for pending migrations
echo "📋 Checking for pending migrations..."
PENDING=$(python manage.py showmigrations --plan | grep "\[ \]" | wc -l)
if [ "$PENDING" -eq 0 ]; then
    echo "✅ No pending migrations"
else
    echo "⚠️  Warning: $PENDING pending migrations found"
    echo "   Run: python manage.py migrate"
fi

# Check if api app is installed
echo "📱 Checking API app..."
python manage.py shell -c "from api.models import Scholarship; print('✅ API app accessible')" 2>/dev/null || {
    echo "❌ API app not accessible"
    exit 1
}

echo ""
echo "🎯 Environment Check Summary:"
echo "✅ Django project found"
echo "✅ Django installed"
echo "✅ Database accessible"
echo "✅ API app working"

if [ "$PENDING" -eq 0 ]; then
    echo "✅ No pending migrations"
    echo ""
    echo "🚀 Environment is ready for scholarship setup!"
    echo "Run: python manage.py create_scholarships"
else
    echo "⚠️  Pending migrations need to be applied first"
    echo ""
    echo "🔧 Next steps:"
    echo "1. python manage.py migrate"
    echo "2. python manage.py create_scholarships"
fi
