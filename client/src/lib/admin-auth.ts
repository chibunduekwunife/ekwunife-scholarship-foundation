// Admin authentication service
interface AdminLoginResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

export const adminLogin = async (username: string, password: string): Promise<AdminLoginResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (response.ok) {
      await response.json();
      return {
        success: true,
        message: 'Authentication successful',
        redirectUrl: process.env.NEXT_PUBLIC_ADMIN_URL || '/admin/'
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Authentication failed'
      };
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      message: 'Authentication service unavailable'
    };
  }
};

// Temporary fallback for development (remove in production)
export const adminLoginFallback = async (username: string, password: string): Promise<AdminLoginResponse> => {
  // This is a temporary fallback that will be removed in production
  // For now, redirect directly to Django admin for any valid-looking credentials
  if (username && password && username.length > 3 && password.length > 8) {
    return {
      success: true,
      message: 'Redirecting to admin panel',
      redirectUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:8001/admin/'
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials'
  };
};
