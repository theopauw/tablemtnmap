from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserDetails, UserRightsDemo, AuditEntry

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
    #non-superuser can only view own details
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(id=request.user.id)
    #new users are created as staff by default (can log in to admin))
    def save_model(self, request, obj, form, change):
        #only superuser should be creating new users as staff
        if request.user.is_superuser:
            obj.is_staff = True
        super().save_model(request, obj, form, change)

class UserRightsDemoAdmin(admin.ModelAdmin):
    #only superuser can view
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        else:
            return None


class AuditEntryAdmin(admin.ModelAdmin):
    list_display = ['action', 'username', 'ip',]
    list_filter = ['action',]
    #only superuser can view
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        else:
            return None


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
# Register UserRightsDemo
admin.site.register(UserRightsDemo, UserRightsDemoAdmin)
# Register AuditEntry
admin.site.register(AuditEntry, AuditEntryAdmin)