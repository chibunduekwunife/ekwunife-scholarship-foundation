from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ApplicationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Application
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create New Application
class ApplicationListCreate(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

# Delete Application
class ApplicationDelete(generics.DestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(author=user)

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