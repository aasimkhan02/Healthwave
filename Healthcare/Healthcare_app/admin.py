from django.contrib import admin
from .models import Medication, PersonalInformation, MedicationToDoTask, UserMedicalInformation, LabRecord

admin.site.register(Medication)
admin.site.register(PersonalInformation)
admin.site.register(UserMedicalInformation)
admin.site.register(LabRecord)
admin.site.register(MedicationToDoTask)
