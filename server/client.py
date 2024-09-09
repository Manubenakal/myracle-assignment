import openai
import os
import base64


client = openai.AzureOpenAI(
        api_version="2024-02-01",
        azure_endpoint="https://genai-nexus.api.corpinter.net/apikey/",
        api_key=PROCESS.ENV.OPENAIKEY
    )


# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def analyse_img(data):

  images = [
      {
        "type":"image_url", 
        "image_url": {
          "url": a
        }
      } for a in data["images"]
    ]


  response = client.chat.completions.create(
      model="gpt-4o",
      messages=[
        {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": '''You are a Senior test engineer. You should proide the testing instructions for the features in a product application. User will be providing the UI screenshots and context. Output should describe a detailed, step-by-step guide on how to test each functionality. Each test case should include:
                Description: What the test case is about.
                Pre-conditions: What needs to be set up or ensured before testing.
                Testing Steps: Clear, step-by-step instructions on how to perform the test.
                Expected Result: What should happen if the feature works correctly.
            provide response in html'''
          },
          {
            "type": "text",
            "text": data["context"]
          }
        ]+images
      }
      ],
      max_tokens=300,
  )
  return response.choices[0].message.content