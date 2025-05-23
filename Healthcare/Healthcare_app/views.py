from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from .tasks import send_medication_notification
from .models import Medication, PersonalInformation, MedicationToDoTask, UserMedicalInformation, LabRecord
from .serializers import (
    MedicationSerializer, 
    MedicationDetailSerializer, 
    UserSerializer, 
    RegisterSerializer, 
    PersonalInformationSerializer, 
    MedicationTaskSerializer, 
    UserMedicalInformationSerializer, 
    LabRecordSerializer
)
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone  # For timezone-aware datetime
from datetime import timedelta 
import logging


logger = logging.getLogger(__name__)
    
class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.GET.get('q', None)
        if query:
            medications = Medication.objects.filter(
                medicine_name__icontains=query
            )[:15]

            unique_meds = {med.medicine_name: med.id for med in medications}

            response_data = [
                {"id": unique_meds[name], "medicine_name": name} 
                for name in unique_meds
            ]
            return Response(response_data, status=status.HTTP_200_OK)

        return Response({"error": "No query parameter provided"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='details/(?P<name>[^/.]+)')
    def medication_details(self, request, name=None):
        # Filter by medicine_name (case-insensitive) to find the specific medication
        medication = Medication.objects.filter(medicine_name__iexact=name).first()  
        if medication:
            serializer = MedicationDetailSerializer(medication)  # Serialize the single match
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()


        PersonalInformation.objects.create(
            user=user,
            first_name='',  
            last_name='',
            gender='',
            email=user.email, 
            phone_number='',
            address='',
            city='',
            state='',
            date_of_birth=None,
            age=None
        )

        UserMedicalInformation.objects.create(
            user=user,
            blood_group='',  
            weight=None,
            height=None,
            allergies='',
            medical_conditions='',
            blood_pressure='',
            blood_sugar_fasting=None,
            blood_sugar_postprandial=None,
            cholesterol_ldl=None,
            cholesterol_hdl=None,
            bmi=None,
            disabilities=''
        )


class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username  # Include the username in the response
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class PersonalInformationViewSet(viewsets.ModelViewSet):
    queryset = PersonalInformation.objects.all()
    serializer_class = PersonalInformationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return PersonalInformation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()  # No need to pass user again since it's already linked

    
class UserMedicalInformationViewSet(viewsets.ModelViewSet):
    queryset = UserMedicalInformation.objects.all()
    serializer_class = UserMedicalInformationSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        return UserMedicalInformation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Save the medical info with the logged-in user

    def perform_update(self, serializer):
        serializer.save()  # No need to pass user again since it's already linked


class MedicationToDoTaskCreate(generics.ListCreateAPIView):
    queryset = MedicationToDoTask.objects.all()
    serializer_class = MedicationTaskSerializer

    def list(self, request, *args, **kwargs):
        username = request.query_params.get('user')
        if not username:
            return Response({"detail": "User parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
            tasks = MedicationToDoTask.objects.filter(user=user)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        username = request.data.get('user')
        if not username:
            return Response({"detail": "User parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        data['user'] = user
        serializer = self.get_serializer(data=data)

        if serializer.is_valid(raise_exception=True):
            task = serializer.save()

            # Schedule a notification for the task (if needed)
            # notification_time = task.start_date + timedelta(hours=task.time.hour, minutes=task.time.minute)
            # send_medication_notification.apply_async((task.id,), eta=notification_time)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LabRecordViewSet(viewsets.ModelViewSet):
    queryset = LabRecord.objects.all()
    serializer_class = LabRecordSerializer
    authentication_classes = [JWTAuthentication]  # Use JWT authentication
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get_queryset(self):
        # Filter lab records by the logged-in user
        return LabRecord.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically link the new record to the logged-in user
        serializer.save(user=self.request.user)