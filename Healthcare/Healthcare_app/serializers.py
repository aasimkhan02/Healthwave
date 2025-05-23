from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Medication, PersonalInformation, MedicationToDoTask, UserMedicalInformation, LabRecord


class MedicationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = [
            'id',
            'medicine_name',
            'salt_composition',
            'product_price',
            'manufacturer_name',
            'medicine_desc',
            'side_effects',
            'drug_interactions',
            'is_discontinued',
            'type',
            'short_composition1',
            'short_composition2',
            'pack_size_label',
        ]


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'medicine_name']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        user = User.objects.create_user(
            username=validated_data['email'],  # Ensure username is unique
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')  # Include necessary fields

class PersonalInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInformation
        fields = [
            'id',
            'user',
            'first_name',
            'last_name',
            'gender',
            'email',
            'phone_number',
            'address',
            'city',
            'state',
            'date_of_birth',
            'age'
        ]
        read_only_fields = ['id', 'user']
        
    def validate(self, data):
        if 'username' in data:
            user = User.objects.filter(username=data['username']).first()
            if not user:
                raise serializers.ValidationError("Username does not exist.")
            data['user'] = user  
        return data



class UserMedicalInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMedicalInformation
        fields = [
            'id',
            'user',
            'blood_group',
            'weight',
            'height',
            'allergies',
            'medical_conditions',
            'blood_pressure',
            'blood_sugar_fasting',
            'blood_sugar_postprandial',
            'cholesterol_ldl',
            'cholesterol_hdl',
            'bmi',
            'disabilities'
        ]
        read_only_fields = ['id', 'user']
        
    def validate(self, data):
        if 'username' in data:
            user = User.objects.filter(username=data['username']).first()
            if not user:
                raise serializers.ValidationError("Username does not exist.")
            data['user'] = user  
        return data


class LabRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabRecord
        fields = ['id', 'test_type', 'description', 'results', 'date', 'doctor']
        read_only_fields = ['user']  # Ensure user field is read-only



class MedicationTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationToDoTask
        fields = '__all__'