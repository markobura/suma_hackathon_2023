from django.urls import path

from code_check.views import run_c_program, check_c_examples

urlpatterns = [
    path("check_c/", run_c_program, name="check_c"),
    path("check_test_examples/", check_c_examples, name="check_examples")
]
