from django.contrib.gis.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class UserDetails(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=100)
    location = models.PointField(srid=3857)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True) # Validators should be a list

#This does nothing outside of the admin page
class UserRightsDemo(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    StringOne = models.CharField(max_length=100)
    StringTwo = models.CharField(max_length=100)
