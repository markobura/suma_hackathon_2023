from django.db import models
from django.utils.translation import gettext_lazy as _


class CourseLevel(models.TextChoices):
    EASY = 1, _('EASY')
    MEDIUM = 2, _('MEDIUM')
    HARD = 3, _('HARD')


class TestCase(models.Model):
    question = models.ForeignKey(to="Question", on_delete=models.CASCADE)
    input = models.TextField()
    output = models.TextField()

    objects = models.Manager()

    def __str__(self):
        return f"Test case for {self.question}"


class Question(models.Model):
    section = models.ForeignKey(to="Section", null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=64, null=True, blank=True)
    text = models.TextField()
    solved_code = models.TextField()

    objects = models.Manager()

    @property
    def test_cases(self):
        return TestCase.objects.filter(question=self)

    def __str__(self):
        return f"Question - {self.name}"


class Section(models.Model):
    name = models.CharField(max_length=64, null=True, blank=True)
    course = models.ForeignKey(to="Course", on_delete=models.CASCADE)
    level = models.CharField(max_length=2, choices=CourseLevel.choices, default=CourseLevel.EASY)

    objects = models.Manager()

    @property
    def questions(self):
        return Question.objects.filter(section=self)

    def __str__(self):
        return f"Section - {self.name}"


class Course(models.Model):
    name = models.CharField(max_length=64, null=True, blank=True)
    level = models.CharField(max_length=2, choices=CourseLevel.choices, default=CourseLevel.EASY)

    objects = models.Manager()

    @property
    def sections(self):
        return Section.objects.filter(course=self)

    def __str__(self):
        return f"Course - {self.name}"
