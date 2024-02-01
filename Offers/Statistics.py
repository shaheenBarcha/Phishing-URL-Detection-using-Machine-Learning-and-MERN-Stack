from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import time
import pyautogui

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

def take_screenshot(driver, screenshot_directory, page_number):
    # Take a screenshot and save it to the specified directory
    screenshot_path = os.path.join(screenshot_directory, f'stats_screenshot_{page_number}.png')
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot {page_number} taken and saved: {screenshot_path}")

def format_url(url):
    # Remove any leading/trailing whitespaces and slashes
    url = url.strip().strip('/')

    # Remove "https://" or "http://" from the beginning of the URL
    url = url.replace("https://", "").replace("http://", "")

    return url

def scroll_full_page_and_take_screenshots(url):
    # Format the URL correctly
    formatted_url = format_url(url)

    # Set Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration for headless mode
    chrome_options.add_argument("--window-size=1920x1080")  # Set window size to avoid rendering issues

    # Initialize the Chrome WebDriver
    driver = webdriver.Chrome(options=chrome_options)

    # Open similarweb.com with the formatted URL
    driver.get(f"https://www.similarweb.com/website/{formatted_url}")

    # Wait for 20 seconds to give time for the page to load
    time.sleep(20)

    # Perform scrolling and capture screenshots
    num_scrolls = 5
    for page_number in range(1, num_scrolls + 1):
        take_screenshot(driver, 'D:/FYP Phish/Statistics', page_number)
        pyautogui.press('pagedown')
        time.sleep(2)

    # Close the browser
    driver.quit()

@app.route('/get_statistics', methods=['POST'])
def get_statistics():
    data = request.get_json()
    url = data['url']

    try:
        # Call the function to scroll and capture screenshots
        scroll_full_page_and_take_screenshots(url)
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error capturing screenshots: {e}")
        return jsonify({'success': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5300)
