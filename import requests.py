import requests
from datetime import datetime

# --- CONFIGURATION ---
API_KEY = "YOUR_API_TOKEN_HERE" # Get this from Electricity Maps Portal
ZONE_ID = "NP" # Zone ID for Nepal
URL = f"https://api.electricitymaps.com/v3/carbon-intensity/latest?zone={ZONE_ID}"

def get_green_status():
    headers = {"auth-token": API_KEY}
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        intensity = data['carbonIntensity']
        timestamp = data['datetime']
        
        print(f"--- 🌍 GREEN-CLOUD MONITOR [{ZONE_ID}] ---")
        print(f"Time: {timestamp}")
        print(f"Current Carbon Intensity: {intensity} gCO2eq/kWh")
        
        # --- LOGIC FOR HACKERS ---
        if intensity < 150:
            print("🟢 STATUS: GREEN. The grid is clean! Perfect time for heavy compilation or AI training.")
        elif intensity < 400:
            print("🟡 STATUS: YELLOW. Moderate carbon impact. Proceed with standard tasks.")
        else:
            print("🔴 STATUS: RED. Grid is dirty. Consider delaying heavy tasks until later.")
            
    except Exception as e:
        print(f"Error connecting to grid data: {e}")

if __name__ == "__main__":
    get_green_status()