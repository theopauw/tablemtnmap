from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
# Create your views here.
from .forms import UserForm, UserProfileForm
from django.contrib.auth.models import User
from .models import UserDetails
from .serializers import UserDetailsSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@login_required
def userProfile(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        userForm = UserForm(request.POST, instance=request.user)
        profileForm = UserProfileForm(request.POST, instance=request.user.userdetails)

        if userForm.is_valid() and profileForm.is_valid():
            userForm.save()
            profileForm.save()
            return HttpResponseRedirect('/')
    else:
        userForm = UserForm(instance=request.user)
        profileForm = UserProfileForm(instance=request.user.userdetails)
        return render(request, 'userprofile/profile.html', {'user_form': userForm, 'profile_form': profileForm})
    return HttpResponseRedirect('/bla')

@login_required
def userMap(request):
    context = {
        'for_later': 0,
    }
    # Render the HTML template index.html with the data in the context variable
    return render(request, 'userprofile/usermap.html', context=context)

@login_required
@api_view(['GET', 'POST'])
def userLocationPoints(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        if request.user.is_superuser:
            serializer = UserDetailsSerializer(UserDetails.objects.all(), many=True)
        else:
            serializer = UserDetailsSerializer(request.user.userdetails)
        return Response(serializer.data)
