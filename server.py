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
    data = response.json()
    # Voeg totaalprijs incl. btw toe
    for entry in data:
        prijs_excl = float(entry["prijs_excl_belastingen"].replace(",", "."))
        entry["prijs_incl_btw"] = round(prijs_excl * 1.21, 6)  # 21% btw
    return data

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prijzen")
def prijzen_vandaag():
    try:
        data = fetch_prices("vandaag")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
