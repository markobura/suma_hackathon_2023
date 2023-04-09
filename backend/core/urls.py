from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('courses/', include('course.urls')),
    path('code/', include('code_check.urls')),

]
