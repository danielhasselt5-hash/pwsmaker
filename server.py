from flask import Flask, render_template, jsonify
import requests
import os

app = Flask(__name__)

# Jouw volledige API-URL inclusief key en parameters
API_URL = (
    "https://jeroen.nl/api/dynamische-energieprijzen/v2/"
    "?period=vandaag&type=json&key=702580027fa5e6ff3b5becd65a3ace1e099e672be09a2ee1e6e87149afcfe496"
)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prijzen")
def prijzen():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()  # Foutmelding bij status != 200
        data = response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Kan API niet ophalen: {e}"}), 500

    prijzen = []
    labels = []

    for entry in data:
        # Converteer prijs_excl_belastingen naar float
        prijs_base = float(entry["prijs_excl_belastingen"].replace(",", "."))
        # Bereken totaalprijs met jouw formule
        prijs_totaal = (prijs_base + 0.0220 + 0.1015) * 1.21
        prijzen.append(round(prijs_totaal, 4))
        labels.append(entry["datum_nl"])

    return jsonify({"labels": labels, "prijzen": prijzen})

if __name__ == "__main__":
    # Voor deployment, Render of andere services bepalen poort via PORT env variable
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
