from flask import Flask, render_template, jsonify
import requests
import os

app = Flask(__name__)

# Vul hier je JSON-API URL in
API_URL = "https://api.example.com/prijzen"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/prijzen")
def prijzen():
    response = requests.get(API_URL)
    data = response.json()

    prijzen = []
    labels = []

    for entry in data:
        # Haal prijs_excl_belastingen en vervang komma door punt
        prijs_base = float(entry["prijs_excl_belastingen"].replace(",", "."))
        # Bereken totaalprijs met nieuwe formule
        prijs_totaal = (prijs_base + 0.0220 + 0.1015) * 1.21
        prijzen.append(round(prijs_totaal, 4))
        labels.append(entry["datum_nl"])

    return jsonify({"labels": labels, "prijzen": prijzen})

if __name__ == "__main__":
    # Haal de poort op uit de omgeving, anders 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
