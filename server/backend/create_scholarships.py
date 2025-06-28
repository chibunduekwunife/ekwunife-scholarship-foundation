#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Scholarship
from datetime import date

def create_scholarships():
    # Delete any existing scholarships first to avoid duplicates
    Scholarship.objects.all().delete()
    print("Deleted existing scholarships")

    # Create SSCE Scholarship
    ssce = Scholarship.objects.create(
        name='Secondary School Scholars SSCE',
        description='A total of ₦1,000,000 will be awarded to the best-performing students from Ekwulobia',
        eligibility_criteria=[
            'Must be from Ekwulobia (Anambra State)',
            'Completed WAEC/NECO in 2025 with at least 5 distinctions (A1–B3)',
            'Scored 280 or above in the 2025 JAMB examination'
        ],
        required_documents=[
            'Scanned copy of 2025 WAEC/NECO result',
            'Scanned copy of 2025 JAMB result',
            'Passport photograph',
            'Short essay (100–150 words): Why I Deserve This Scholarship',
            'Contact info: email & phone number'
        ],
        deadline=date(2025, 7, 30)
    )

    # Create BGUS Scholarship
    bgus = Scholarship.objects.create(
        name='Best Graduating University Students',
        description='In recognition of academic consistency, two prizes will be awarded to graduates from Ekwulobia',
        eligibility_criteria=[
            'Must be from Ekwulobia',
            'Graduated from a Nigerian university in the 2024/2025 academic year',
            'Must submit official certificate and transcript showing a minimum of Second Class Upper (2:1)'
        ],
        required_documents=[
            'Passport photograph',
            'Official certificate of graduation',
            'Official university transcript',
            'Contact info: email & phone number',
            'Optional statement: My Academic Journey (100–200 words)'
        ],
        deadline=date(2025, 7, 30)
    )

    print(f'Created scholarships:')
    print(f'1. {ssce.name} (ID: {ssce.id})')
    print(f'2. {bgus.name} (ID: {bgus.id})')

if __name__ == '__main__':
    create_scholarships()
