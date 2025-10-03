from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import GetUserView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path
from django.views.static import serve

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

# Serve static files (handled by WhiteNoise in production)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # In production, explicitly serve media through Django. Consider moving to cloud storage for scale.
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT, "show_indexes": False}),
    ]
