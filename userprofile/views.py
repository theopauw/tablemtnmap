from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
from .forms import UserForm, UserProfileForm

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
