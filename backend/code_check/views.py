from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import subprocess


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
        return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

    # Run the program with the provided input and capture its output
    try:
        output = subprocess.check_output(['./temp'], input=input_str, universal_newlines=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        # If there was an error running the program, return an error response
        error_message = e.output.strip()
        return Response({'error': error_message})

    # Return the output of the program as a JSON response
    return Response({'output': output})
