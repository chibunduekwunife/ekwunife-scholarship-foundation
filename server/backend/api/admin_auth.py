from django.contrib.auth import authenticate, login
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def admin_auth(request):
    """
    Custom admin authentication endpoint
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            logger.warning(f"Admin login attempt with missing credentials from IP: {request.META.get('REMOTE_ADDR')}")
            return JsonResponse({
                'success': False,
                'message': 'Username and password are required'
            }, status=400)
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user and user.is_active and user.is_staff:
            # Log in the user to create session
            login(request, user)
            
            # Log successful admin access
            logger.info(f"Successful admin login for user: {username} from IP: {request.META.get('REMOTE_ADDR')}")
            
            return JsonResponse({
                'success': True,
                'message': 'Authentication successful',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'is_superuser': user.is_superuser
                }
            })
        else:
            # Log failed attempts
            logger.warning(f"Failed admin login attempt for username: {username} from IP: {request.META.get('REMOTE_ADDR')}")
            
            return JsonResponse({
                'success': False,
                'message': 'Invalid credentials or insufficient permissions'
            }, status=401)
            
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in admin auth request from IP: {request.META.get('REMOTE_ADDR')}")
        return JsonResponse({
            'success': False,
            'message': 'Invalid request format'
        }, status=400)
        
    except Exception as e:
        logger.error(f"Admin auth error: {str(e)} from IP: {request.META.get('REMOTE_ADDR')}")
        return JsonResponse({
            'success': False,
            'message': 'Authentication service error'
        }, status=500)

@staff_member_required
def admin_status(request):
    """
    Check admin authentication status
    """
    return JsonResponse({
        'authenticated': True,
        'user': {
            'username': request.user.username,
            'email': request.user.email,
            'is_superuser': request.user.is_superuser
        }
    })
