from django.contrib import admin
from .models import HealthVideo
from .models import HealthInformation

# Register your models here.
@admin.register(HealthVideo)
class HealthVideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploaded_at']

@admin.register(HealthInformation)
class HealthInformationAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']