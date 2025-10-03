from django.contrib import admin
from django.utils import timezone
from django import forms
from django.utils.safestring import mark_safe
from django.db import models
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

class TargetBlankAdminFileWidget(admin.widgets.AdminFileWidget):
    def render(self, name, value, attrs=None, renderer=None):
        html = super().render(name, value, attrs=attrs, renderer=renderer)
        # Ensure the existing "Currently:" link opens in a new tab
        try:
            return mark_safe(html.replace('<a ', '<a target="_blank" rel="noopener noreferrer" '))
        except Exception:
            return html

class TranscriptInlineForm(forms.ModelForm):
    class Meta:
        model = ApplicationTranscript
        fields = '__all__'
        widgets = {
            'file': TargetBlankAdminFileWidget,
        }

class PassportInlineForm(forms.ModelForm):
    class Meta:
        model = ApplicationPassportPhoto
        fields = '__all__'
        widgets = {
            'image': TargetBlankAdminFileWidget,
        }

class TranscriptInline(admin.TabularInline):
    model = ApplicationTranscript
    form = TranscriptInlineForm
    extra = 0
    fields = ('file', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

class PassportPhotoInline(admin.TabularInline):
    model = ApplicationPassportPhoto
    form = PassportInlineForm
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

    # Make single-file fields open in new tab too
    formfield_overrides = {
        models.FileField: {'widget': TargetBlankAdminFileWidget},
        models.ImageField: {'widget': TargetBlankAdminFileWidget},
    }
    
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
