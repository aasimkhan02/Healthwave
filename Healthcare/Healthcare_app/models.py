import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

from django.db import models

class Medication(models.Model):
    medicine_name = models.CharField(max_length=255, blank=True, null=True)
    salt_composition = models.CharField(max_length=255, blank=True, null=True)  # Added based on the dataset
    product_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Added for price
    manufacturer_name = models.CharField(max_length=255, blank=True, null=True)
    medicine_desc = models.TextField(blank=True, null=True)  # Added based on the dataset
    side_effects = models.TextField(blank=True, null=True)  # Added for side effects
    drug_interactions = models.TextField(blank=True, null=True)  # Added for drug interactions
    is_discontinued = models.BooleanField(default=False, blank=True, null=True)  # Added based on your dataset
    type = models.CharField(max_length=255, blank=True, null=True)  # Added for type
    short_composition1 = models.CharField(max_length=255, blank=True, null=True)  # Added based on the dataset
    short_composition2 = models.CharField(max_length=255, blank=True, null=True)  # Added based on the dataset
    pack_size_label = models.CharField(max_length=255, blank=True, null=True)  # Added based on the dataset

    def __str__(self):
        return self.medicine_name if self.medicine_name else 'No Name'


class PersonalInformation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='personal_info')
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=30, blank=True, null=True)
    state = models.CharField(max_length=30, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return self.user.username  # or any other representation you prefer

class UserMedicalInformation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='medical_info')  # Link to the User model
    blood_group = models.CharField(max_length=10, blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)  # Store weight in kg
    height = models.FloatField(blank=True, null=True)  # Store height in feet
    allergies = models.TextField(blank=True, null=True)
    medical_conditions = models.TextField(blank=True, null=True)
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)
    blood_sugar_fasting = models.FloatField(blank=True, null=True)
    blood_sugar_postprandial = models.FloatField(blank=True, null=True)
    cholesterol_ldl = models.FloatField(blank=True, null=True)
    cholesterol_hdl = models.FloatField(blank=True, null=True)
    bmi = models.FloatField(blank=True, null=True)
    disabilities = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username


class LabRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test_type = models.CharField(max_length=100)
    description = models.TextField()
    results = models.FileField(upload_to='lab_results/')
    date = models.DateField()
    doctor = models.CharField(max_length=100)

class MedicationToDoTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    medication = models.CharField(max_length=255, blank=True, null=True)
    dosage = models.CharField(max_length=255, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    frequency = models.CharField(max_length=255, blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)  # Remove auto_now_add=True temporarily
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.medication
