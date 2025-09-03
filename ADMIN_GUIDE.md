# 🔐 Admin Panel Access Guide

## Overview
The Ekwunife Scholarship Foundation application now includes an admin panel that allows authorized administrators to manage scholarships and review applications.

## How to Access Admin Panel

### Step 1: Navigate to Home Page
- Go to http://localhost:3001 (or your deployed frontend URL)
- Look for the "Admin?" button in the top navigation bar

### Step 2: Admin Login
- Click the "Admin?" button
- You'll be redirected to `/admin/login`
- Enter admin credentials (see below)

### Step 3: Access Django Admin
- After successful authentication, Django admin panel opens in a new tab
- Navigate through Scholarships and Applications sections

## Development Credentials

**For development/testing purposes:**
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Important:** Change these credentials in production!

## Admin Panel Features

### Scholarship Management
- View all available scholarships
- Add new scholarship programs
- Edit scholarship details, criteria, and deadlines
- Manage eligibility requirements

### Application Review
- View all submitted applications
- Filter applications by:
  - Status (pending, approved, rejected)
  - Scholarship type
  - Gender, village, submission date
- Search applications by name, phone, or school
- Review application details including:
  - Personal information
  - Educational background
  - Uploaded documents
  - Essays and referrals

### Admin Interface Features
- **List View:** Quick overview of all records
- **Detail View:** Complete application/scholarship information
- **Filtering:** Advanced filtering options
- **Search:** Full-text search capabilities
- **Export:** Data export options (via Django admin)

## Security Notes

### Development
- Demo credentials are embedded for easy testing
- Admin panel opens in new tab for convenience
- Full Django admin functionality available

### Production Considerations
- Remove demo credentials
- Implement proper authentication flow
- Use environment variables for admin settings
- Enable HTTPS for admin access
- Consider IP restrictions for admin access
- Regular security audits

## Technical Details

### Frontend Implementation
- Admin button in navbar (`/components/layout/navbar.tsx`)
- Admin login page (`/app/admin/login/page.tsx`)
- Basic credential validation (development only)

### Backend Implementation
- Django admin configuration (`/api/admin.py`)
- Model registration for Scholarship and Application
- Custom admin views with proper fieldsets
- Readonly fields for metadata

### Local Development Setup
1. **Frontend:** `cd client && npm run dev` (runs on port 3001)
2. **Backend:** `cd server/backend && source .venv/bin/activate && python manage.py runserver 0.0.0.0:8001`
3. **Admin access:** http://localhost:8001/admin/

## Troubleshooting

### "Port already in use" Error
- Check if Django is already running: `ps aux | grep python`
- Kill existing processes or use different port
- Run: `python manage.py runserver 0.0.0.0:8002`

### Admin Login Issues
- Verify Django server is running on port 8001
- Check superuser exists: `python manage.py createsuperuser`
- Ensure correct credentials are used

### No Data in Admin Panel
- Run migrations: `python manage.py migrate`
- Create sample data: `python manage.py create_scholarships`
- Check database connection

## Future Enhancements

### Authentication
- [ ] Integrate with main user authentication system
- [ ] Role-based access control
- [ ] JWT token validation
- [ ] Session management

### Features
- [ ] Application status management workflow
- [ ] Bulk actions for applications
- [ ] Email notifications to applicants
- [ ] Advanced reporting and analytics
- [ ] Document preview capabilities

### Security
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] Session timeout
- [ ] IP whitelisting

---

**Admin panel is now ready for use! 🚀**
