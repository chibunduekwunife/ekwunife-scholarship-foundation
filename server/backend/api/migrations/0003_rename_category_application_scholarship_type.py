# Generated by Django 5.2.3 on 2025-06-28 02:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_application_passport_photo_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='application',
            old_name='category',
            new_name='scholarship_type',
        ),
    ]
