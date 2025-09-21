from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Scholarship, Application, ApplicationTranscript, ApplicationPassportPhoto

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = ["id", "name", "description", "eligibility_criteria", "required_documents", "deadline"]

class ApplicationTranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationTranscript
        fields = ['id', 'file', 'uploaded_at']

class ApplicationPassportPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationPassportPhoto
        fields = ['id', 'image', 'uploaded_at']

class ApplicationSerializer(serializers.ModelSerializer):
    transcript_files = ApplicationTranscriptSerializer(many=True, read_only=True)
    passport_photos = ApplicationPassportPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'scholarship',
            'reviewer',
            'applicant',
            'full_name',
            'age',
            'gender',
            'village',
            'phone_number',
            'residential_address',
            'scholarship_type',  # Changed from category
            'school',
            'graduation_year',
            'grades',
            'transcript_documents',
            'passport_photo',
            'transcript_files',
            'passport_photos',
            'essay',
            'referral_source',
            'referral_source_confirmed',
            'submitted_at',
            'status',
        ]
        extra_kwargs = {"applicant": {"read_only": True}}