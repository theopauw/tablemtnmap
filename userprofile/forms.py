from django import forms
from django.contrib.auth.models import User
from .models import UserDetails

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            'username', 'email',# 'first_name', 'last_name',
        )

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserDetails
        fields = (
            'address', #'location', 'phone_number'
        )
