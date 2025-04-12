from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Confession, Category, Comment
from .serializers import ConfessionSerializer, CategorySerializer, CommentSerializer

# Create your views here.
def index(request):
    return JsonResponse({'message': 'Whisper backend working! 🔥'})

class ConfessionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Confession.objects.all().order_by('-created_at')
    serializer_class = ConfessionSerializer

class ConfessionDetailAPIView(generics.RetrieveDestroyAPIView):
    queryset = Confession.objects.all()
    serializer_class = ConfessionSerializer
    
    
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    
class ConfessionListCreateView(generics.ListCreateAPIView):
    serializer_class = ConfessionSerializer

    def get_queryset(self):
        queryset = Confession.objects.all()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset
    
    
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class LikeCommentView(APIView):
    def post(self, request, pk):
        try:
            comment = Comment.objects.get(pk=pk)
            comment.likes += 1
            comment.save()
            return Response({"likes": comment.likes}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)