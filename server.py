from flask import Flask, jsonify, render_template
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
API_KEY = os.getenv("JEROEN_API_KEY")
API_URL = "https://jeroen.nl/api/dynamische-energieprijzen/v2/"

app = Flask(__name__, static_folder="static", template_folder="templates")

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

    for entry in data:
        # Gebruik alle componenten + 21% btw
        prijs_excl = (
            float(entry["energiebelasting"].replace(",", ".")) +
            float(entry["inkoopvergoeding"].replace(",", ".")) +
            float(entry["marktprijs"].replace(",", "."))
        )
        entry["prijs_totaal"] = round(prijs_excl * 1.21, 4)
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
