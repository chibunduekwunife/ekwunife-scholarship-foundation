from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import GetUserView
from django.conf import settings
from django.conf.urls.static import static

# authentication / registration paths
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/signup/", CreateUserView.as_view(), name="signup"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/user/", GetUserView, name="get_user"),
    path("api/", include("api.urls")),
]

# Serve static files in production
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # For production, we need to serve static files differently
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
