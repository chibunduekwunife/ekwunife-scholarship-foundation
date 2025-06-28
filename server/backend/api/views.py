from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, ApplicationSerializer, ScholarshipSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Application, Scholarship
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date, timedelta

# Create New Application
class ApplicationListCreate(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(applicant=user)
    
    def perform_create(self, serializer):
        # Ensure there's a default scholarship
        if not Scholarship.objects.exists():
            Scholarship.objects.create(
                name='Secondary School Scholars SSCE',
                description='A total of ₦1,000,000 will be awarded to the best-performing students from Ekwulobia',
                deadline=date.today() + timedelta(days=365)
            )
        
        if serializer.is_valid():
            # Get scholarship based on scholarship_type or use default
            scholarship_type = serializer.validated_data.get('scholarship_type', '')
            
            if 'University' in scholarship_type or 'BGUS' in scholarship_type:
                scholarship = Scholarship.objects.filter(name__icontains='University').first()
            else:
                scholarship = Scholarship.objects.filter(name__icontains='SSCE').first()
            
            # Fallback to first available scholarship
            if not scholarship:
                scholarship = Scholarship.objects.first()
                
            serializer.save(applicant=self.request.user, scholarship=scholarship)
        else:
            print("Serializer errors:", serializer.errors)
            
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print(f"Error creating application: {e}")
            print(f"Request data: {request.data}")
            return Response(
                {"error": str(e), "details": "Check server logs for more information"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# Delete Application
class ApplicationDelete(generics.DestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(applicant=user)

# Create New User View
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Get User View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserView(request):
    user = request.user
    return Response({'username': user.username, 'email': user.email})

# Get Available Scholarships
class ScholarshipList(generics.ListAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [AllowAny]  # Allow anyone to view available scholarships