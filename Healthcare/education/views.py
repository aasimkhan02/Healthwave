from django.shortcuts import render
from .models import HealthVideo
from .models import HealthInformation

# Create your views here
def home(request):
    return render(request, 'home.html')

def video_list(request):
    query = request.GET.get('q')
    if query:
        videos = HealthVideo.objects.filter(title__icontains=query)
    else:
        videos = HealthVideo.objects.all()

    # Transform URLs into embeddable format
    for video in videos:
        if "watch?v=" in video.video_url:
            video.video_url = video.video_url.replace('watch?v=', 'embed/')

    return render(request, 'video_list.html', {'videos': videos})

#info
def info(request):
    query = request.GET.get('q')
    if query:
        informations = HealthInformation.objects.filter(title__icontains=query)
    else:
        informations = HealthInformation.objects.all()
    return render(request, 'info.html', {'informations': informations})

#for view more info
def information_detail(request, id):
    information = HealthInformation.objects.get(pk=id)
    return render(request, 'information_detail.html', {'information': information})
