import os

import django
import json


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from course.models import Course, Section, Question, TestCase


if __name__ == "__main__":
    filename = f"resources/courses.json"
    with open(filename) as f:
        json_data = json.load(f)
        for el in json_data:
            Course.objects.create(**el)
    filename = f"resources/sections.json"
    with open(filename) as f:
        json_data = json.load(f)
        for el in json_data:
            course_id = el.pop("course")
            Section.objects.create(**el, course=Course.objects.get(id=course_id))
    filename = f"resources/questions.json"
    with open(filename) as f:
        json_data = json.load(f)
        for el in json_data:
            section_id = el.pop("section")
            Question.objects.create(**el, section=Section.objects.get(id=section_id))
    filename = f"resources/test_cases.json"
    with open(filename) as f:
        json_data = json.load(f)
        for el in json_data:
            question_id = el.pop("question")
            TestCase.objects.create(**el, question=Question.objects.get(id=question_id))
