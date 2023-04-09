from rest_framework import generics
from .models import Course, Question
from .serializers import CourseSerializer, CourseMinSerializer, QuestionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404


class CourseListAPIView(generics.GenericAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseMinSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer

    def post(self, request, *args, **kwargs):
        course = get_object_or_404(Course, id=kwargs.get("pk"))
        serializer = self.serializer_class(course)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class QuestionDetailView(generics.RetrieveAPIView):
    serializer_class = QuestionSerializer

    def post(self, request, *args, **kwargs):
        question = get_object_or_404(Question, id=kwargs.get("pk"))
        serializer = self.serializer_class(question)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
