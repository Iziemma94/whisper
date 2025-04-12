from django.urls import path
from . import views
from .views import (
    ConfessionListCreateAPIView,
    ConfessionDetailAPIView,
    CategoryListCreateView,
    CategoryDetailView,
    CommentListCreateView,
    LikeCommentView
)

urlpatterns = [
    path('', views.index),
    
    # Confessions
    path('confessions/', ConfessionListCreateAPIView.as_view(), name='confession-list'),
    path('confessions/<int:pk>/', ConfessionDetailAPIView.as_view(), name='confession-detail'),

    # Categories
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # Comments
    path('api/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('api/comments/<int:pk>/like/', LikeCommentView.as_view(), name='like-comment'),
]
