from django.urls import path
from .import views

urlpatterns=[
    path('',views.home,name='home'),
    path('videos/', views.video_list, name='video_list'),
    path('info/', views.info, name='info'),
    path('info/<int:id>/', views.information_detail, name='information_detail'),
]