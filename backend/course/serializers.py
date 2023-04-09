from rest_framework import serializers
from .models import TestCase, Question, Section, Course


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    test_cases = TestCaseSerializer(many=True)

    class Meta:
        model = Question
        fields = '__all__'


class QuestionMinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = ["name", "id"]


class SectionSerializer(serializers.ModelSerializer):
    questions = QuestionMinSerializer(many=True)

    class Meta:
        model = Section
        fields = '__all__'


class CourseMinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ["id", "name"]


class CourseSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True)

    class Meta:
        model = Course
        fields = '__all__'
