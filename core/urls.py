from django.urls import path
from . import views

urlpatterns = [
    path('', views.scena, name='scena'),
    path('watchlist/', views.watchlist, name='watchlist'),
    path('shows/', views.shows, name='shows'),
    path('actors/', views.actors, name='actors'),
    path('details/', views.details, name='details'),
    path('rates/', views.rates, name='rates'),
    path('signup/', views.signup, name='register'),
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_view, name='logout'),
]