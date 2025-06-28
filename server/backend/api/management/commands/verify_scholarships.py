from django.core.management.base import BaseCommand
from api.models import Scholarship, Application


class Command(BaseCommand):
    help = 'Verify scholarship setup and show statistics'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('=== Scholarship System Status ===\n')
        )
        
        # Check scholarships
        scholarships = Scholarship.objects.all()
        self.stdout.write(f'📚 Total Scholarships: {scholarships.count()}')
        
        if scholarships.count() == 0:
            self.stdout.write(
                self.style.ERROR('❌ No scholarships found!')
            )
            self.stdout.write(
                self.style.WARNING('Run: python manage.py create_scholarships')
            )
            return
        
        self.stdout.write('\n📋 Available Scholarships:')
        for scholarship in scholarships:
            app_count = Application.objects.filter(scholarship=scholarship).count()
            self.stdout.write(
                f'  • {scholarship.name} (ID: {scholarship.id})'
            )
            self.stdout.write(
                f'    - Applications: {app_count}'
            )
            self.stdout.write(
                f'    - Deadline: {scholarship.deadline}'
            )
        
        # Check applications
        total_applications = Application.objects.count()
        self.stdout.write(f'\n📝 Total Applications: {total_applications}')
        
        if total_applications > 0:
            self.stdout.write('\n📊 Applications by Scholarship:')
            for scholarship in scholarships:
                count = Application.objects.filter(scholarship=scholarship).count()
                self.stdout.write(f'  • {scholarship.name}: {count} applications')
        
        self.stdout.write(
            self.style.SUCCESS('\n✅ Scholarship system is ready!')
        )
        
        self.stdout.write('\n🔗 API Endpoints:')
        self.stdout.write('  • GET /api/scholarships/ - List scholarships')
        self.stdout.write('  • GET /api/applications/ - List applications')
        self.stdout.write('  • POST /api/applications/ - Create application')
