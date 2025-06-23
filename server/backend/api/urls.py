from django.urls import path
from . import views

urlpatterns = [
    path("applications/", views.ApplicationListCreate.as_view(), name="application-list"),
    path("applications/delete/<int:pk>/", views.ApplicationDelete.as_view(), name="delete-application"),
    
]