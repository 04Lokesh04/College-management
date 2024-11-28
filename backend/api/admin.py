from django.contrib import admin
from .models import Faculty, User
from django.contrib.auth.admin import UserAdmin

# Custom UserAdmin to show all fields for User in the Admin interface
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'first_name', 'last_name', 'email', 'is_faculty', 'is_student']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_faculty', 'is_student')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('is_faculty', 'is_student')}),
    )

# Register the custom UserAdmin
admin.site.register(User, CustomUserAdmin)

# Faculty Admin to allow editing Faculty details
class FacultyAdmin(admin.ModelAdmin):
    # Include all User fields in the Faculty creation form
    list_display = ['user', 'subject']
    search_fields = ['user__username', 'user__email', 'subject']
    ordering = ['user__username']

    # You can customize the admin form to show both User fields and Faculty fields.
    fieldsets = (
        (None, {
            'fields': ('user', 'subject')  # Fields for Faculty model
        }),
    )

    def save_model(self, request, obj, form, change):
        # Make sure the user is saved with the correct roles
        obj.user.is_faculty = True
        obj.user.is_student = False
        obj.user.save()
        return super().save_model(request, obj, form, change)

# Register FacultyAdmin
admin.site.register(Faculty, FacultyAdmin)
