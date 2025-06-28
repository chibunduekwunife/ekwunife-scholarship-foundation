# Production Deployment Guide

## Setting Up Scholarships in Production

This guide will help you populate your production database with the required scholarships.

### Prerequisites

1. Your Django application should be deployed and running
2. Database migrations should be applied
3. You should have SSH access to your production server

### Option 1: Using the Management Command (Recommended)

#### Method A: SSH into your production server

```bash
# SSH into your production server
ssh your-production-server

# Navigate to your Django project directory
cd /path/to/your/django/project

# Activate your virtual environment (if using one)
source venv/bin/activate  # or whatever your venv path is

# Run the management command
python manage.py create_scholarships
```

#### Method B: Using the deployment script

If you've copied the deployment script to your server:

```bash
# On your production server
cd /path/to/your/project/server/deployment
./setup_production_scholarships.sh
```

### Option 2: Using Django Fixtures

If you prefer to use fixtures:

```bash
# On your production server
cd /path/to/your/django/project
python manage.py loaddata api/fixtures/scholarships.json
```

### Option 3: One-liner for quick setup

```bash
python manage.py migrate && python manage.py create_scholarships
```

### Verification

After running any of the above, verify the scholarships were created:

```bash
# Check scholarships in database
python manage.py shell -c "from api.models import Scholarship; [print(f'{s.id}: {s.name}') for s in Scholarship.objects.all()]"

# Test the API endpoint
curl https://your-domain.com/api/scholarships/
```

### Expected Output

You should see two scholarships:
1. **Secondary School Scholars SSCE** - For high school graduates
2. **Best Graduating University Students** - For university graduates

### Troubleshooting

#### If you get "Permission denied" errors:
```bash
chmod +x setup_production_scholarships.sh
```

#### If scholarships already exist:
```bash
python manage.py create_scholarships --force
```

#### If you get database errors:
Make sure migrations are applied first:
```bash
python manage.py migrate
python manage.py create_scholarships
```

### Integration with CI/CD

If you're using CI/CD, add this to your deployment pipeline:

```yaml
# Example for GitHub Actions, GitLab CI, etc.
- name: Setup scholarships
  run: |
    python manage.py migrate
    python manage.py create_scholarships
```

### Environment Variables

Make sure your production environment has the correct database settings:
- `DATABASE_URL` (if using)
- `DJANGO_SETTINGS_MODULE`
- Any other required environment variables

### Security Notes

- The management command uses `get_or_create()` so it's safe to run multiple times
- Use `--force` only if you need to recreate scholarships
- Make sure your production database is properly backed up before running
