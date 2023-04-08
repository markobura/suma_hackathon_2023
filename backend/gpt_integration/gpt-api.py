import openai
import os

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


# Define a function to call the Chat GPT API and return the generated response
def generate_response(prompt):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=60,
        n=1,
        stop=None,
        temperature=0.7,
    )

    return response.choices[0].text.strip()
