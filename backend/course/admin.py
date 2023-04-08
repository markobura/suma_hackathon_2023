from django.contrib import admin

from course.models import Course, Question, Section, TestCase

# Register your models here.
admin.site.register((Course, Question, Section, TestCase))
