from django.db import models
from django.contrib.auth.models import User

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tmdb_id = models.IntegerField()  # ID iz TMDB-a
    media_type = models.CharField(max_length=10)  # "movie" ili "tv"
    created_at = models.DateTimeField(auto_now_add=True)
    
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tmdb_id = models.IntegerField()
    media_type = models.CharField(max_length=10, default="movie")

    stars = models.IntegerField()
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(default=timezone.now)