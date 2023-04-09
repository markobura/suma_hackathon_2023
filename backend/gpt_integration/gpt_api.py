import os
import json

import openai

from course.models import TestCase

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


# Define a function to call the Chat GPT API and return the generated response
def generate_response(prompt):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    return response.choices[0].text.strip()


def give_optimization_suggestions(my_code: str, task: str):
    starting_prompt = """
    First check if there can be some time and space complexity optimization done. Focus on time and space complexity for this task.
    Check if there can me something done better in this code.
    Suggest how to format code better if its needed in code.
    Your response should be in next format and only in this format:
    {"suggestions" : ["text for suggestion1", "text for suggestion2",,,]}
    """
    prompt = starting_prompt
    prompt += f"This is task: {task}"
    prompt += f"This is my code: {my_code}"

    while True:
        try:
            res = generate_response(prompt)
            res = json.loads(res)
            break
        except Exception as e:
            print('test')
            continue
    return res


def give_compilation_error_explanation(compilation_error: str, my_code: str):
    starting_prompt = """
    Just explain me why this code doesnt compile and why is this error that is generated.
    Be short in your response, don't use more than 3 sentences
    Dont comment any other part of code, just focus on why compilation error occurred.
    Your solution should be in next format:
    {"cause": "Cause of compilation error"}
    """
    prompt = starting_prompt
    prompt += f"This is code with compilation error {my_code} \n"
    prompt += f"This is compilation_error {compilation_error}\n "

    res = generate_response(prompt)
    return json.loads(res)


def give_hint_on_error(task_text: str, working_code: str, my_code: str, failed_test_case: TestCase):
    starting_prompt = """
    Act like you are high school professor and answering to me.
    I will give you exercise question, working code in C,  my code in C and i will give you test case that is not working for me.
    Your job is to answer me with HINT how i could fix this solution.
    Use working code as reference but my code is not necessary to be the same as working one.
    I don't have any knowledge of working code so don't mention it at all. The working code you can use only as an example of correct solution
    Don't answer with code, just give hint what part is problem.
    If whole logic is really bad you can suggest on changing logic but only if my logic is really bad.
    Don't give me solution in hints.
    Each hint should be one or two sentences but preferably one.
    If problem is complex answer me with more hints, from one that doesn't explain everything to ones that explains what to do. But only if problem is complex.
    Don't give me what is not the problem
    It's okay to be only two, more complex problems would require more hints. Make sure last hint helps the most and that i am able to solve problem using it
    Don't reference working code in any way on answering.
    Variable names shouldn't be an issue, don't hint them you should hint only why is it not working properly
    """
    prompt = starting_prompt
    prompt += f"This is task: {task_text} \n"
    prompt += f"This is working code: {working_code} \n"
    prompt += f"This is my code: {my_code} \n"
    prompt += f"Test case that is not good: \n"
    prompt += f"input: {failed_test_case.input}\n"
    prompt += f"expected output {failed_test_case.output}"
    prompt += """Your response should be in the next format 
    {"hints": ["text for hint1", "text for hint2"...]}"""

    res = generate_response(prompt)
    return json.loads(res)

