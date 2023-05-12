from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth.models import User
from .models import UserDetails
from rest_framework import serializers

#Just get the username for now
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username"]

class UserDetailsSerializer(GeoFeatureModelSerializer):
    """ A class to serialize locations as GeoJSON compatible data """
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserDetails
        geo_field = "location"
        fields = ["user", "location"]

