from django.urls import path

from course.views import CourseListAPIView, QuestionDetailView, CourseDetailView

urlpatterns = [
    path("courses/", CourseListAPIView.as_view(), name="course_list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course_detail"),
    path("questions/<int:pk>/", QuestionDetailView.as_view(), name="question_detail"),
]
