from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import subprocess

from course.models import TestCase, Question
from gpt_integration.gpt_api import give_hint_on_error, give_compilation_error_explanation, \
    give_optimization_suggestions


@api_view(['POST'])
def run_c_program(request):
    # Validate that input and program fields are present in the request data
    input_str = request.data.get('input', '')
    program_str = request.data.get('program')
    if program_str is None:
        return Response({'error': 'Program fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create a temporary file to hold the program code
    with open('temp.c', 'w') as f:
        f.write(program_str)

    # Compile the program with gcc and capture any errors
    try:
        subprocess.check_output(['gcc', '-o', 'temp', 'temp.c'], stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        # If there was an error compiling the program, return an error response
        error_message = e.output.decode('utf-8')
        return Response(status=status.HTTP_200_OK, data={'output': error_message, 'state': 'Compiling error'})

    # Run the program with the provided input and capture its output
    try:
        output = subprocess.check_output(['./temp'], input=input_str, universal_newlines=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        # If there was an error running the program, return an error response
        error_message = e.output.strip()
        return Response(status=status.HTTP_200_OK, data={'output': error_message, 'state': 'Runtime error'})

    # Return the output of the program as a JSON response
    return Response(status=status.HTTP_200_OK, data={'output': output, 'state': 'Executed'})


def validate_code_output(program_str, input_str, expected_output_str):
    # Create a temporary file to write the C program to
    with open('temp.c', 'w') as f:
        f.write(program_str)

    # Compile the C program using GCC
    proc = subprocess.Popen(['gcc', '-o', 'temp', 'temp.c'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate()

    if stderr:
        # Compilation failed, return False
        return False

    # Run the compiled program with the given input
    proc = subprocess.Popen(['./temp'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    stdout, _ = proc.communicate(input=input_str.encode())

    # Decode the output and strip any whitespace
    program_output_str = stdout.decode().strip()
    expected_output_str = expected_output_str.strip()

    # Compare the program output to the expected output
    return program_output_str == expected_output_str


def check_program_for_compiling(program_str):
    with open('temp.c', 'w') as f:
        f.write(program_str)
    try:
        subprocess.check_output(['gcc', '-o', 'temp', 'temp.c'], stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        # If there was an error compiling the program, return an error response
        error_message = e.output.decode('utf-8')
        return False, error_message
    return True, None


@api_view(['POST'])
def check_c_examples(request):
    program_str = request.data.get('program')
    is_compiled, err = check_program_for_compiling(program_str)
    if not is_compiled:
        return Response(status=status.HTTP_200_OK, data={'message': err, 'state': 'Compiling error', "success": None})

    question_id = request.data.get('question_id')

    test_cases = TestCase.objects.filter(question=question_id)
    question = Question.objects.get(id=question_id)
    tests_passed = True
    failed_test = None
    # TODO add percentage of solved test cases
    for i, test_case in enumerate(test_cases):
        res = validate_code_output(program_str, test_case.input, test_case.output)
        if not res:
            tests_passed = False
            failed_test = test_case
            break

    if tests_passed:
        return Response(status=status.HTTP_200_OK, data={"message": "All tests passed", "success": True})
    else:
        return Response(status=status.HTTP_200_OK, data={"message": "Some tests failed", "success": False})


@api_view(['POST'])
def optimize_code(request):
    program_str = request.data.get('program')
    question_id = request.data.get('question_id')
    question = Question.objects.get(id=question_id)
    res = give_optimization_suggestions(program_str, question.text)
    return Response(status=status.HTTP_200_OK, data={"gpt_answer": res})


@api_view(['POST'])
def explain_compilation_error(request):
    program_str = request.data.get('program')
    is_compiled, err = check_program_for_compiling(program_str)
    res = give_compilation_error_explanation(err, program_str)
    return Response(status=status.HTTP_200_OK, data={"gpt_answer": res})


@api_view(['POST'])
def give_hints(request):
    program_str = request.data.get('program')
    question_id = request.data.get('question_id')

    test_cases = TestCase.objects.filter(question=question_id)
    question = Question.objects.get(id=question_id)
    tests_passed = True
    failed_test = None
    for i, test_case in enumerate(test_cases):
        res = validate_code_output(program_str, test_case.input, test_case.output)
        if not res:
            tests_passed = False
            failed_test = test_case
            break

    if tests_passed:
        return Response(status=status.HTTP_200_OK, data={"message": "All tests passed", "success": False})
    else:
        res = give_hint_on_error(question.text, question.solved_code, program_str, failed_test)
        return Response(status=status.HTTP_200_OK,
                        data={"message": "Some tests failed", "gpt_answer": res, "success": False})
