# Generated by Django 4.2 on 2023-05-15 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0003_userrightsdemo'),
    ]

    operations = [
        migrations.CreateModel(
            name='AuditEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=64)),
                ('ip', models.GenericIPAddressField(null=True)),
                ('username', models.CharField(max_length=256, null=True)),
            ],
        ),
    ]
