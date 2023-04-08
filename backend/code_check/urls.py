from django.urls import path

from code_check.views import run_c_program

urlpatterns = [
    path("check_c/", run_c_program, name="check_c"),

]
