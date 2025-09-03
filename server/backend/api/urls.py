from django.urls import path
from . import views
from . import admin_auth

urlpatterns = [
    path("applications/", views.ApplicationListCreate.as_view(), name="application-list"),
    path("applications/delete/<int:pk>/", views.ApplicationDelete.as_view(), name="delete-application"),
    path("scholarships/", views.ScholarshipList.as_view(), name="scholarship-list"),
    
    # Admin authentication endpoints
    path("admin/auth/", admin_auth.admin_auth, name="admin-auth"),
    path("admin/status/", admin_auth.admin_status, name="admin-status"),
]