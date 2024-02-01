from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import time
import pyautogui
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import socket
import geocoder

app = Flask(__name__)
CORS(app)

# Helper functions
def take_screenshot(driver, screenshot_directory, page_number):
    screenshot_path = os.path.join(screenshot_directory, f'stats_screenshot_{page_number}.png')
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot {page_number} taken and saved: {screenshot_path}")

def format_url(url):
    url = url.strip().strip('/')
    url = url.replace("https://", "").replace("http://", "")
    return url

def scroll_full_page_and_take_screenshots(url):
    formatted_url = format_url(url)
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920x1080")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(f"https://www.similarweb.com/website/{formatted_url}")
    time.sleep(20)
    num_scrolls = 5
    for page_number in range(1, num_scrolls + 1):
        take_screenshot(driver, 'D:/FYP Phish/Statistics', page_number)
        pyautogui.press('pagedown')
        time.sleep(2)
    driver.quit()

def get_alexa_rank(url):
    base_url = 'https://www.scamadviser.com/'
    headers = {'User-Agent': 'Mozilla/5.0'}
    search_url = f"{base_url}check-website/{url}"

    try:
        response = requests.get(search_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')

    try:
        accordion_rows = soup.find_all('div', class_='accordion-block__answer__row')
        for row in accordion_rows:
            key_element = row.find('div', class_='block__col')
            if key_element and key_element.text.strip() == 'Alexa rank':
                alexa_rank_value = key_element.find_next('div', class_='block__col').text.strip()
                return alexa_rank_value
    except AttributeError:
        pass

    return 'Not Available'

def get_whois_results(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    domain_info_block = soup.find('div', class_='df-heading', string='Domain Information')
    registrar_block = soup.find('div', class_='df-label', string='Registrar:')
    expires_on_block = soup.find('div', class_='df-label', string='Expires On:')
    updated_on_block = soup.find('div', class_='df-label', string='Updated On:')
    registered_on_block = soup.find('div', class_='df-label', string='Registered On:')
    
    registrar = registrar_block.find_next_sibling('div', class_='df-value').text.strip() if registrar_block else "Not found"
    expires_on = expires_on_block.find_next_sibling('div', class_='df-value').text.strip() if expires_on_block else "Not found"
    updated_on = updated_on_block.find_next_sibling('div', class_='df-value').text.strip() if updated_on_block else "Not found"
    registered_on = registered_on_block.find_next_sibling('div', class_='df-value').text.strip() if registered_on_block else "Not found"
    
    extracted_info = {
        'Registrar': registrar,
        'Expires On': expires_on,
        'Updated On': updated_on,
        'Registered On': registered_on
    }
    
    return extracted_info

# Routes
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

@app.route('/scan_website', methods=['POST'])
def scan_website():
    data = request.get_json()
    url = data['url']
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    time.sleep(5)
    num_scrolls = 1
    for page_number in range(1, num_scrolls + 1):
        take_screenshot(driver, 'D:/FYP Phish/WebScans', page_number)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
    driver.quit()
    return jsonify({'success': True})

@app.route('/alexa_rank', methods=['POST'])
def alexa_rank():
    data = request.get_json()
    url = data['url']
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    alexa_rank = get_alexa_rank(domain)
    return jsonify({'rank': alexa_rank})

@app.route('/get_whois_results', methods=['POST'])
def get_whois_results_endpoint():
    data = request.get_json()
    url = data['url']
    search_url = 'https://www.whois.com/whois/' + url
    whois_results = get_whois_results(search_url)
    return jsonify(whois_results)

@app.route('/get_statistics', methods=['POST'])
def get_statistics():
    data = request.get_json()
    url = data['url']
    try:
        scroll_full_page_and_take_screenshots(url)
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error capturing screenshots: {e}")
        return jsonify({'success': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100)
