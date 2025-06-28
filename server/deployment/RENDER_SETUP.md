# Render Deployment Configuration

## 🚀 After GitHub Push - Render Setup

### Step 1: Render Auto-Deploy
If you have auto-deploy enabled, Render will automatically detect your GitHub push and redeploy.

### Step 2: Update Build Command (Optional but Recommended)
In your Render dashboard, update your build command to include scholarship setup:

**Current build command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

**Updated build command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate && python manage.py create_scholarships
```

### Step 3: Manual Setup (Alternative)
If you prefer manual setup, after deployment:

1. Go to Render Dashboard
2. Select your web service  
3. Click "Shell" tab
4. Run: `python manage.py create_scholarships`

### Step 4: Verify Setup
Test your API endpoint:
```bash
curl https://your-render-app.onrender.com/api/scholarships/
```

## 🔧 Render Settings You May Need

### Environment Variables
Make sure these are set in Render:
- `DJANGO_SETTINGS_MODULE=backend.settings`
- `DATABASE_URL` (should be auto-configured)
- Any other custom environment variables

### Build Settings
- **Build Command**: See updated command above
- **Start Command**: `gunicorn backend.wsgi:application`
- **Python Version**: 3.12.x (or your preferred version)

## 🐛 Troubleshooting

### If scholarships don't appear:
1. Check Render logs for errors
2. Use Render shell to run: `python manage.py verify_scholarships`
3. Manually run: `python manage.py create_scholarships`

### If API returns 500 error:
1. Check Render logs
2. Verify database connection
3. Ensure migrations ran successfully

### If build fails:
1. Check requirements.txt is in correct location
2. Verify all dependencies are listed
3. Check Python version compatibility

## 📋 Quick Verification Checklist

After deployment:
- [ ] Render deployment successful
- [ ] No build errors in logs
- [ ] Database migrations applied
- [ ] Scholarships created (2 total)
- [ ] API endpoint `/api/scholarships/` returns data
- [ ] Frontend can load scholarship dropdown

## 🆘 Emergency Recovery

If something goes wrong:
```bash
# In Render shell
python manage.py migrate
python manage.py create_scholarships --force
python manage.py verify_scholarships
```
