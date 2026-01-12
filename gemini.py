# pip install -U google-genai

from google import genai
from google.genai import types

client = genai.Client(api_key="YOUR_API_KEY") # replace YOUR_API_KEY with your actual API key

# Load your fridge image
with open("fridge.jpg", "rb") as img:
    fridge_image = img.read()

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents=[
        "What meals can I make with this?",
        types.Part.from_bytes(
            data=fridge_image,
            mime_type="image/jpeg"
        )
    ]
)

print(response.text)
