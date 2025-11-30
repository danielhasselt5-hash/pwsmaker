from flask import Flask, jsonify, send_from_directory
import requests
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

API_URL = "https://api.energyzero.nl/v1/energyprices?offset=0&start=now&end=now+1d&interval=15m"

@app.route("/")
def index():
    return send_from_directory("templates", "index.html")

@app.route("/prijzen")
def prijzen():
    resp = requests.get(API_URL)
    data = resp.json()

    resultaten = []

    for item in data:
        prijs_excl = float(item["prijs_excl_belastingen"].replace(",", "."))

        # totaalprijs berekening
        prijs_incl_btw = round(prijs_excl * 1.21, 4)

        resultaten.append({
            "datum_nl": item["datum_nl"],
            "datum_utc": item["datum_utc"],
            "prijs_excl_belastingen": prijs_excl,
            "prijs_incl_btw": prijs_incl_btw
        })

    return jsonify(resultaten)

@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory("static", path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
