from django.urls import path
from . import views

app_name = 'main'
urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('<int:list_id>/', views.todoList, name='list'),
]
