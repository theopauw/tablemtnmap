# Generated by Django 4.2 on 2023-05-12 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
