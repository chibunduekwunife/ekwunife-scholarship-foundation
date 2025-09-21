from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# scholarship model
class Scholarship(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    eligibility_criteria = models.JSONField(default=list)
    required_documents = models.JSONField(default=list) 
    deadline = models.DateField()

    def __str__(self):
        return self.name

# scholarship application model
class Application(models.Model):

    # one to many fields
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE, related_name='applications')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviewed_applications', null=True, blank=True)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_applications')

    # step 1
    full_name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=50)
    village = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    residential_address = models.CharField(max_length=255)
    
    # step 2
    scholarship_type = models.CharField(max_length=100)  # Changed from category
    school = models.CharField(max_length=255)
    graduation_year = models.CharField(max_length=10)
    grades = models.JSONField(default=list)  # or CharField if storing as text
    transcript_documents = models.FileField(upload_to='results/', null=True, blank=True)
    passport_photo = models.ImageField(upload_to='passports/', null=True, blank=True)

    # step 3
    essay = models.TextField()
    referral_source = models.CharField(max_length=255, blank=True)
    referral_source_confirmed = models.BooleanField(default=False)

    # extras
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending')

    def __str__(self):
        return self.full_name

class ApplicationPassportPhoto(models.Model):
    application = models.ForeignKey('Application', on_delete=models.CASCADE, related_name='passport_photos')
    image = models.ImageField(upload_to='passports/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PassportPhoto({self.id}) for {self.application.full_name}"

class ApplicationTranscript(models.Model):
    application = models.ForeignKey('Application', on_delete=models.CASCADE, related_name='transcript_files')
    file = models.FileField(upload_to='results/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transcript({self.id}) for {self.application.full_name}"