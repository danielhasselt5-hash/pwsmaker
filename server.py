from flask import Flask, jsonify, render_template
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("JEROEN_API_KEY")
API_URL = "https://jeroen.nl/api/dynamische-energieprijzen/v2/"

app = Flask(__name__)

def fetch_prices(period="vandaag"):
    params = {
        "period": period,
        "type": "json",
        "key": API_KEY
    }
    response = requests.get(API_URL, params=params)
    response.raise_for_status()
    return response.json()  # hele lijst teruggeven

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prijzen")
def prijzen_vandaag():
    try:
        data = fetch_prices("vandaag")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
