from celery import shared_task
from datetime import datetime
from django.utils import timezone
from .models import MedicationToDoTask

@shared_task
def send_medication_notification(task_id):
    try:
        task = MedicationToDoTask.objects.get(id=task_id)
        # Your notification logic here, e.g., sending an email or a message
        print(f"Time to take your medication: {task.medication} - Dosage: {task.dosage}")
    except MedicationToDoTask.DoesNotExist:
        pass  # Handle the case where the task does not exist anymore
