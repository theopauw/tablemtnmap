from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from userprofile.models import UserDetails

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class UserDetailsInline(admin.StackedInline):
    model = UserDetails
    can_delete = False
    verbose_name_plural = "userdetails"

# Define a new User admin
class CustomUserAdmin(UserAdmin):
    #also view user details
    inlines = [UserDetailsInline]
    #tried to make that all superusers and staff have view permission
    #but this doesn't work sadly. TODO check
    '''def has_view_permission(self, request, obj=None):
        if request.user.is_superuser or request.user.is_staff:
            return True
        return True'''
    #non-superuser can only view own details
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(id=request.user.id)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
