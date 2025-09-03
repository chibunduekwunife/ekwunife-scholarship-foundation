# Render + Vercel Deployment Guide

## Overview
This guide will help you deploy the Ekwunife Scholarship Foundation to:
- **Render.com**: Django backend with PostgreSQL database
- **Vercel**: Next.js frontend

## 🔧 Backend Deployment (Render)

### 1. Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### 2. Create PostgreSQL Database
1. In Render dashboard, click "New" → "PostgreSQL"
2. Name: `ekwunife-db`
3. Plan: Free (for development)
4. Note down the database connection details

### 3. Deploy Django Backend
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ekwunife-backend`
   - **Branch**: `main`
   - **Root Directory**: `server/backend`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.wsgi:application`
   - **Plan**: Free

### 4. Set Environment Variables in Render
Go to your web service → Environment and add:

```
SECRET_KEY=yw+_*-2ws4%w6-_z()uv9ox0gfex3!(h%fpkcizh397em9$^cv
DEBUG=False
ALLOWED_HOSTS=ekwunife-backend.onrender.com
ADMIN_USERNAME=eksf#@2050
ADMIN_PASSWORD=}}lcm2eksf1&*(30)
ADMIN_EMAIL=admin@ekwunife.org
DATABASE_URL=postgresql://[your-render-db-url]
PYTHON_VERSION=3.12.3
```

**Important**: Replace `[your-render-db-url]` with the actual database URL from step 2.

## 🌐 Frontend Deployment (Vercel)

### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### 2. Deploy Next.js Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Set Environment Variables in Vercel
In project settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://ekwunife-backend.onrender.com
NEXT_PUBLIC_ADMIN_URL=https://ekwunife-backend.onrender.com/admin/
```

**Important**: Replace `ekwunife-backend` with your actual Render service name.

## 🔒 Security Configuration

### Update Backend CORS Settings
After deployment, update your backend environment variables:

```
ALLOWED_HOSTS=ekwunife-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

## 🧪 Testing Your Deployment

### 1. Test Backend
Visit: `https://your-backend.onrender.com/admin/`
- Should show Django admin login
- Use credentials: `eksf#@2050` / `}}lcm2eksf1&*(30)`

### 2. Test Frontend
Visit: `https://your-frontend.vercel.app`
- Click "Admin?" button
- Should redirect to admin login
- After login, should access Django admin panel

### 3. Test API Connection
Test the admin authentication endpoint:
```bash
curl -X POST https://your-backend.onrender.com/api/admin/auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "eksf#@2050", "password": "}}lcm2eksf1&*(30)"}'
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Push all code to GitHub
- [ ] Verify all environment variables are set correctly
- [ ] Test locally one more time

### Render Backend
- [ ] Create PostgreSQL database
- [ ] Deploy web service
- [ ] Set all environment variables
- [ ] Verify build completed successfully
- [ ] Test Django admin access

### Vercel Frontend
- [ ] Deploy from GitHub
- [ ] Set environment variables with backend URL
- [ ] Verify build completed successfully
- [ ] Test admin button functionality

### Post-deployment
- [ ] Update CORS settings with frontend URL
- [ ] Test complete admin workflow
- [ ] Verify scholarship data is accessible
- [ ] Set up monitoring/alerts (optional)

## 🚨 Common Issues & Solutions

### Build Fails on Render
- Check build logs for Python/dependency errors
- Verify all requirements are in `requirements.txt`
- Ensure database migrations run successfully

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in Django
- Ensure both services are running

### Admin Login Fails
- Verify admin user was created (`update_admin_credentials` command)
- Check environment variables are set correctly
- Review Django logs for authentication errors

## 🔄 Future Updates

To update your deployment:

1. **Push to GitHub**: Changes will auto-deploy
2. **Environment Variables**: Update in Render/Vercel dashboards
3. **Database Changes**: Migrations will run automatically on Render

## 📞 Support

If you encounter issues:
1. Check Render/Vercel deployment logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check CORS and security settings

---

**Your apps will be available at:**
- Backend: `https://your-backend-name.onrender.com`
- Frontend: `https://your-app-name.vercel.app`
- Admin Panel: `https://your-backend-name.onrender.com/admin/`
