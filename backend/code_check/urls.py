from django.urls import path

from code_check.views import run_c_program, check_c_examples, explain_compilation_error, give_hints, optimize_code

urlpatterns = [
    path("check_c/", run_c_program, name="check_c"),
    path("check_test_examples/", check_c_examples, name="check_examples"),
    path("give_hints/", give_hints, name="give_hints"),
    path("compilation_error/", explain_compilation_error, name="compilation_error"),
    path("optimize/", optimize_code, name="optimize_code")
]
