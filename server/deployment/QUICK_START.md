# Production Quick Start - Scholarship Setup

## 🚀 Quick Commands for Production

### Setup Scholarships (Choose one):

#### Option 1: Management Command (Recommended)
```bash
python manage.py create_scholarships
```

#### Option 2: Using Fixture
```bash
python manage.py loaddata api/fixtures/scholarships.json
```

#### Option 3: Complete Deployment
```bash
./deployment/deploy_production.sh
```

### Verification Commands:

```bash
# Check scholarship status
python manage.py verify_scholarships

# List scholarships in database
python manage.py shell -c "from api.models import Scholarship; [print(f'{s.id}: {s.name}') for s in Scholarship.objects.all()]"

# Test API endpoint
curl https://your-domain.com/api/scholarships/
```

### If Something Goes Wrong:

```bash
# Recreate scholarships
python manage.py create_scholarships --force

# Check for errors
python manage.py check

# Apply pending migrations
python manage.py migrate
```

## 📋 Expected Results

After setup, you should have:
- ✅ 2 scholarships in database
- ✅ API endpoint `/api/scholarships/` working
- ✅ Frontend can load scholarship dropdown
- ✅ Applications can be submitted with correct scholarship ID

## 🔍 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No scholarships found" | Run `python manage.py create_scholarships` |
| "Permission denied" | Run `chmod +x deployment/*.sh` |
| API returns empty array | Check scholarships exist in database |
| Frontend dropdown empty | Verify API endpoint is accessible |

## 📞 Support

If issues persist:
1. Check Django logs
2. Verify database connection
3. Ensure migrations are applied
4. Test API endpoints manually
