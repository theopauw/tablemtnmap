from django.urls import path

from . import views

urlpatterns = [
    path("", views.userProfile, name="userprofile"),
    path("usermap", views.userMap, name="usermap"),
    path("userlocationpoints", views.userLocationPoints, name="userlocationpoints"),
]
