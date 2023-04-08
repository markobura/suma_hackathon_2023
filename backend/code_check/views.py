from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import subprocess
from rest_framework.generics import get_object_or_404

from course.models import Question, TestCase


@api_view(['POST'])
def run_c_program(request):
    # return Response(status=status.HTTP_200_OK, data={"message": True})
    # Validate that input and program fields are present in the request data
    input_str = request.data.get('input', '')
    program_str = request.data.get('program')
    if program_str is None:
        return Response({'error': 'Both input and program fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

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
        print(e.output)
        # If there was an error running the program, return an error response
        print('test')
        error_message = e.output.strip()
        return Response(status=status.HTTP_200_OK, data={'error': error_message, 'state': 'Runtime error'})

    # Return the output of the program as a JSON response
    return Response(status=status.HTTP_200_OK, data={'output': output, 'state': 'Executed'})


def validate_code_output(program_str, input_str, expected_output_str):
    """
    Validates whether the output of a C program matches the expected output for a given input.

    Args:
        program_str (str): C program as a string
        input_str (str): Input for the program as a string
        expected_output_str (str): Expected output of the program as a string

    Returns:
        bool: True if the output of the program matches the expected output for the given input, False otherwise.
    """
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


@api_view(['POST'])
def check_c_examples(request):
    program_str = request.data.get('program')
    question_id = request.data.get('question_id')

    test_cases = TestCase.objects.filter(question=question_id)
    tests_passed = True
    for i, test_case in enumerate(test_cases):
        res = validate_code_output(program_str, test_case.input, test_case.output)
        if not res:
            tests_passed = False
            break

    if tests_passed:
        return Response(status=status.HTTP_200_OK, data={"message": "All tests passed"})
    else:
        return Response(status=status.HTTP_200_OK, data={"message": "Some tests failed"})







