from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def get_whois_results(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the relevant div blocks
    domain_info_block = soup.find('div', class_='df-heading', string='Domain Information')
    registrar_block = soup.find('div', class_='df-label', string='Registrar:')
    expires_on_block = soup.find('div', class_='df-label', string='Expires On:')
    updated_on_block = soup.find('div', class_='df-label', string='Updated On:')
    registered_on_block = soup.find('div', class_='df-label', string='Registered On:')
    
    # Extract the corresponding values
    registrar = registrar_block.find_next_sibling('div', class_='df-value').text.strip() if registrar_block else "Not found"
    expires_on = expires_on_block.find_next_sibling('div', class_='df-value').text.strip() if expires_on_block else "Not found"
    updated_on = updated_on_block.find_next_sibling('div', class_='df-value').text.strip() if updated_on_block else "Not found"
    registered_on = registered_on_block.find_next_sibling('div', class_='df-value').text.strip() if registered_on_block else "Not found"
    
    # Prepare the extracted information
    extracted_info = {
        'Registrar': registrar,
        'Expires On': expires_on,
        'Updated On': updated_on,
        'Registered On': registered_on
    }
    
    return extracted_info

@app.route('/get_whois_results', methods=['POST'])
def get_whois_results_endpoint():
    data = request.get_json()
    url = data['url']
    search_url = 'https://www.whois.com/whois/' + url

    # Call the function to get the WHOIS results
    whois_results = get_whois_results(search_url)

    # Return the WHOIS results to the MERN app
    return jsonify(whois_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100)
