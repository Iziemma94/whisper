from django.contrib import admin
from .models import User, Category, Confession, Comment
# Register your models here.
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Confession)
admin.site.register(Comment)