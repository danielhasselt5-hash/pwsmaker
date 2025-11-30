from flask import Flask, jsonify, render_template
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
API_KEY = os.getenv("JEROEN_API_KEY")
API_URL = "https://jeroen.nl/api/dynamische-energieprijzen/v2/"

app = Flask(__name__)

def fetch_prices(period="vandaag"):
    """Haalt prijzen op en berekent totaal incl. 21% btw."""
    params = {
        "period": period,
        "type": "json",
        "key": API_KEY
    }
    response = requests.get(API_URL, params=params)
    response.raise_for_status()
    data = response.json()
    # Voeg totaalprijs incl btw toe
    for entry in data:
        # Totaal = energiebelasting + inkoopvergoeding + marktprijs, dan keer 1,21
        prijs_total = float(entry.get("energiebelasting", "0").replace(",", ".")) \
                     + float(entry.get("inkoopvergoeding", "0").replace(",", ".")) \
                     + float(entry.get("marktprijs", "0").replace(",", "."))
        entry["prijs_totaal"] = round(prijs_total * 1.21, 4)
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
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
