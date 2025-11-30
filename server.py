from flask import Flask, render_template, jsonify
import requests
import os

app = Flask(__name__)

# API URL en API key apart
API_URL = "https://jeroen.nl/api/dynamische-energieprijzen/v2/"
API_KEY = "702580027fa5e6ff3b5becd65a3ace1e099e672be09a2ee1e6e87149afcfe496"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prijzen")
def prijzen():
    # Bouw de volledige URL met parameters
    params = {
        "period": "vandaag",
        "type": "json",
        "key": API_KEY
    }

    response = requests.get(API_URL, params=params)
    data = response.json()

    prijzen = []
    labels = []

    for entry in data:
        prijs_base = float(entry["prijs_excl_belastingen"].replace(",", "."))
        prijs_totaal = (prijs_base + 0.0220 + 0.1015) * 1.21
        prijzen.append(round(prijs_totaal, 4))
        labels.append(entry["datum_nl"])

    # Bereken gemiddelde prijs
    gemiddelde = round(sum(prijzen)/len(prijzen), 4)

    return jsonify({"labels": labels, "prijzen": prijzen, "gemiddelde": gemiddelde})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
