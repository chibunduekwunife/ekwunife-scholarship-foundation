from django.contrib import admin
from django.utils import timezone
from .models import Scholarship, Application, ApplicationTranscript, ApplicationPassportPhoto

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ['name', 'deadline']
    list_filter = ['deadline']
    search_fields = ['name', 'description']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Criteria & Documents', {
            'fields': ('eligibility_criteria', 'required_documents')
        }),
        ('Timeline', {
            'fields': ('deadline',)
        }),
    )

class TranscriptInline(admin.TabularInline):
    model = ApplicationTranscript
    extra = 0
    fields = ('file', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

class PassportPhotoInline(admin.TabularInline):
    model = ApplicationPassportPhoto
    extra = 0
    fields = ('image', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'scholarship', 'status', 'age', 'village', 'submitted_at']
    list_filter = ['status', 'scholarship', 'gender', 'village', 'submitted_at']
    search_fields = ['full_name', 'phone_number', 'school']
    readonly_fields = ['submitted_at']
    inlines = [TranscriptInline, PassportPhotoInline]
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'age', 'gender', 'village', 'phone_number', 'residential_address')
        }),
        ('Scholarship Information', {
            'fields': ('scholarship', 'scholarship_type', 'status', 'applicant', 'reviewer')
        }),
        ('Educational Background', {
            'fields': ('school', 'graduation_year', 'grades')
        }),
        ('Documents', {
            'fields': ('transcript_documents', 'passport_photo')
        }),
        ('Essay & Referral', {
            'fields': ('essay', 'referral_source', 'referral_source_confirmed')
        }),
        ('Metadata', {
            'fields': ('submitted_at',),
            'classes': ('collapse',)
        }),
    )
