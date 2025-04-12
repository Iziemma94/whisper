from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

# Custom user model for flexibility later
class User(AbstractUser):
    pass  # For now, we use Django’s built-in features

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Confession(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_anonymous = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title[:50]}..."
    

class Comment(models.Model):
    confession = models.ForeignKey(Confession, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=50, blank=True, default='Anonymous')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_anonymous = models.BooleanField(default=True)
    likes = models.PositiveIntegerField(default=0)
    is_nsfw = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment on '{self.confession.title[:30]}...' by {self.name}"

