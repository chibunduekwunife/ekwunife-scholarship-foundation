from django.urls import path
from . import views
from . import admin_auth

urlpatterns = [
    path("applications/", views.ApplicationListCreate.as_view(), name="application-list"),
    path("applications/<int:pk>/", views.ApplicationDetail.as_view(), name="application-detail"),
    path("applications/delete/<int:pk>/", views.ApplicationDelete.as_view(), name="delete-application"),
    path("scholarships/", views.ScholarshipList.as_view(), name="scholarship-list"),

    # File download endpoints (authenticated)
    path("applications/<int:pk>/transcripts/<int:file_id>/download/", views.download_transcript, name="download-transcript"),
    path("applications/<int:pk>/passports/<int:file_id>/download/", views.download_passport, name="download-passport"),
    path("applications/<int:pk>/transcript/download/", views.download_legacy_transcript, name="download-legacy-transcript"),
    path("applications/<int:pk>/passport/download/", views.download_legacy_passport, name="download-legacy-passport"),
    
    # Admin authentication endpoints
    path("admin/auth/", admin_auth.admin_auth, name="admin-auth"),
    path("admin/status/", admin_auth.admin_status, name="admin-status"),

    # Contact endpoint
    path("contact/", views.contact_message, name="contact-message"),
]