from django.db import models

# Create your models here.
class HealthVideo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    video_url = models.URLField(max_length=500)  # This is the URL to the video (YouTube, Vimeo, etc.)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class HealthInformation(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
