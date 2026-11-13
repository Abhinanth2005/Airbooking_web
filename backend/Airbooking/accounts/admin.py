from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'approval_status')
    list_filter = ('is_staff', 'approval_status')
    search_fields = ('email', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Information', {'fields': ('first_name', 'last_name')}),
        ('Approval', {'fields': ('approval_status',)}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'user_permissions', 'groups')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
       
    )

    add_fieldsets = (
                (None, {
                    'classes': ('wide',),
                    'fields': ('email', 'password1', 'password2', 'approval_status', 'is_staff', 'is_superuser',),
                }),
            ),
    filter_horizontal = ('user_permissions', 'groups',)