from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicationToDoTaskCreate,
    MedicationViewSet,
    RegisterView,
    LoginView,
    PersonalInformationViewSet,
    UserMedicalInformationViewSet,
    LabRecordViewSet,
)

# Set up the router
router = DefaultRouter()
router.register(r'medications', MedicationViewSet)
router.register(r'personal-info', PersonalInformationViewSet)
router.register(r'medical-info', UserMedicalInformationViewSet)
router.register(r'lab-records', LabRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include all routes from the router
    path('medication-tasks/', MedicationToDoTaskCreate.as_view(), name='medication-tasks'),
    path('search-names/', MedicationViewSet.as_view({'get': 'search'}), name='medication-search'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
