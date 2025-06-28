from django.core.management.base import BaseCommand
from api.models import Scholarship
from datetime import date


class Command(BaseCommand):
    help = 'Create default scholarships for the application'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Delete existing scholarships and recreate them',
        )

    def handle(self, *args, **options):
        if options['force']:
            self.stdout.write(
                self.style.WARNING('Deleting existing scholarships...')
            )
            Scholarship.objects.all().delete()

        # Check if scholarships already exist
        existing_count = Scholarship.objects.count()
        if existing_count > 0 and not options['force']:
            self.stdout.write(
                self.style.WARNING(
                    f'Found {existing_count} existing scholarships. '
                    'Use --force to recreate them.'
                )
            )
            return

        # Create SSCE Scholarship
        ssce, created = Scholarship.objects.get_or_create(
            name='Secondary School Scholars SSCE',
            defaults={
                'description': 'A total of ₦1,000,000 will be awarded to the best-performing students from Ekwulobia',
                'eligibility_criteria': [
                    'Must be from Ekwulobia (Anambra State)',
                    'Completed WAEC/NECO in 2025 with at least 5 distinctions (A1–B3)',
                    'Scored 280 or above in the 2025 JAMB examination'
                ],
                'required_documents': [
                    'Scanned copy of 2025 WAEC/NECO result',
                    'Scanned copy of 2025 JAMB result',
                    'Passport photograph',
                    'Short essay (100–150 words): Why I Deserve This Scholarship',
                    'Contact info: email & phone number'
                ],
                'deadline': date(2025, 7, 30)
            }
        )

        # Create BGUS Scholarship
        bgus, created = Scholarship.objects.get_or_create(
            name='Best Graduating University Students',
            defaults={
                'description': 'In recognition of academic consistency, two prizes will be awarded to graduates from Ekwulobia',
                'eligibility_criteria': [
                    'Must be from Ekwulobia',
                    'Graduated from a Nigerian university in the 2024/2025 academic year',
                    'Must submit official certificate and transcript showing a minimum of Second Class Upper (2:1)'
                ],
                'required_documents': [
                    'Passport photograph',
                    'Official certificate of graduation',
                    'Official university transcript',
                    'Contact info: email & phone number',
                    'Optional statement: My Academic Journey (100–200 words)'
                ],
                'deadline': date(2025, 7, 30)
            }
        )

        self.stdout.write(
            self.style.SUCCESS('Successfully created scholarships:')
        )
        self.stdout.write(
            self.style.SUCCESS(f'1. {ssce.name} (ID: {ssce.id})')
        )
        self.stdout.write(
            self.style.SUCCESS(f'2. {bgus.name} (ID: {bgus.id})')
        )

        # Display all scholarships
        self.stdout.write('\nAll scholarships in database:')
        for scholarship in Scholarship.objects.all():
            self.stdout.write(f'- {scholarship.name} (ID: {scholarship.id})')
