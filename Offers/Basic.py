from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import geocoder
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

@app.route('/geolocation', methods=['POST'])
def geolocation():
    data = request.get_json()
    url = data['url']
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname
    IP = socket.gethostbyname(hostname)
    g = geocoder.ip(IP)
    geolocation_data = {
        'IP': IP,
        'City': g.city,
        'Region': g.state,
        'Country': g.country
    }
    return jsonify(geolocation_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
