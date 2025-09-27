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
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
import os
import re

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
            app_instance = serializer.instance
            # Handle multiple uploads
            for f in self.request.FILES.getlist('transcript_documents'):
                from .models import ApplicationTranscript
                ApplicationTranscript.objects.create(application=app_instance, file=f)
            for img in self.request.FILES.getlist('passport_photo'):
                from .models import ApplicationPassportPhoto
                ApplicationPassportPhoto.objects.create(application=app_instance, image=img)
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

# Get Individual Application
class ApplicationDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(applicant=user)
    
    def get_object(self):
        application_id = self.kwargs.get('pk')
        return get_object_or_404(Application, id=application_id, applicant=self.request.user)
    
    def perform_update(self, serializer):
        # Handle scholarship type updates
        if serializer.is_valid():
            scholarship_type = serializer.validated_data.get('scholarship_type', '')
            
            if 'University' in scholarship_type or 'BGUS' in scholarship_type:
                scholarship = Scholarship.objects.filter(name__icontains='University').first()
            else:
                scholarship = Scholarship.objects.filter(name__icontains='SSCE').first()
            
            # Fallback to first available scholarship
            if not scholarship:
                scholarship = Scholarship.objects.first()
                
            serializer.save(scholarship=scholarship)
            app_instance = serializer.instance

            # Deletions if requested
            delete_transcript_ids = self.request.data.getlist('delete_transcript_ids')
            delete_passport_ids = self.request.data.getlist('delete_passport_photo_ids')
            if delete_transcript_ids:
                from .models import ApplicationTranscript
                ApplicationTranscript.objects.filter(application=app_instance, id__in=delete_transcript_ids).delete()
            if delete_passport_ids:
                from .models import ApplicationPassportPhoto
                ApplicationPassportPhoto.objects.filter(application=app_instance, id__in=delete_passport_ids).delete()

            # Add new files if provided
            for f in self.request.FILES.getlist('transcript_documents'):
                from .models import ApplicationTranscript
                ApplicationTranscript.objects.create(application=app_instance, file=f)
            for img in self.request.FILES.getlist('passport_photo'):
                from .models import ApplicationPassportPhoto
                ApplicationPassportPhoto.objects.create(application=app_instance, image=img)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_transcript(request, pk: int, file_id: int):
    app = get_object_or_404(Application, id=pk, applicant=request.user)
    from .models import ApplicationTranscript
    obj = get_object_or_404(ApplicationTranscript, id=file_id, application=app)
    f = obj.file
    if not f or not os.path.exists(f.path):
        raise Http404
    base = os.path.basename(f.name)
    name, ext = os.path.splitext(base)
    safe_full = re.sub(r'[^A-Za-z0-9_-]+', '_', app.full_name)
    filename = f"{name}_{safe_full}{ext}"
    response = FileResponse(open(f.path, 'rb'), as_attachment=True, filename=filename)
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_passport(request, pk: int, file_id: int):
    app = get_object_or_404(Application, id=pk, applicant=request.user)
    from .models import ApplicationPassportPhoto
    obj = get_object_or_404(ApplicationPassportPhoto, id=file_id, application=app)
    f = obj.image
    if not f or not os.path.exists(f.path):
        raise Http404
    base = os.path.basename(f.name)
    name, ext = os.path.splitext(base)
    safe_full = re.sub(r'[^A-Za-z0-9_-]+', '_', app.full_name)
    filename = f"{name}_{safe_full}{ext}"
    response = FileResponse(open(f.path, 'rb'), as_attachment=True, filename=filename)
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_legacy_transcript(request, pk: int):
    app = get_object_or_404(Application, id=pk, applicant=request.user)
    f = app.transcript_documents
    if not f or not hasattr(f, 'path') or not os.path.exists(f.path):
        raise Http404
    base = os.path.basename(f.name)
    name, ext = os.path.splitext(base)
    safe_full = re.sub(r'[^A-Za-z0-9_-]+', '_', app.full_name)
    filename = f"{name}_{safe_full}{ext}"
    return FileResponse(open(f.path, 'rb'), as_attachment=True, filename=filename)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_legacy_passport(request, pk: int):
    app = get_object_or_404(Application, id=pk, applicant=request.user)
    f = app.passport_photo
    if not f or not hasattr(f, 'path') or not os.path.exists(f.path):
        raise Http404
    base = os.path.basename(f.name)
    name, ext = os.path.splitext(base)
    safe_full = re.sub(r'[^A-Za-z0-9_-]+', '_', app.full_name)
    filename = f"{name}_{safe_full}{ext}"
    return FileResponse(open(f.path, 'rb'), as_attachment=True, filename=filename)