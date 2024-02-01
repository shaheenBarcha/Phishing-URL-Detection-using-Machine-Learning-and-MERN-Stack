from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import os
import time

app = Flask(__name__)
CORS(app)

def take_screenshot(driver, screenshot_directory, page_number):
    # Take a screenshot and save it to the specified directory
    screenshot_path = os.path.join(screenshot_directory, f'similarweb_screenshot_{page_number}.png')
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot {page_number} taken and saved: {screenshot_path}")

def scroll_full_page_and_take_screenshots(url):
    # Set Chrome options for running with a headless browser
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")  # This line makes the browser run in headless mode

    # Initialize the Chrome WebDriver
    driver = webdriver.Chrome(options=chrome_options)

    # Open similarweb.com with the user-provided URL
    driver.get(f"{url}")

    # Wait for 20 seconds to give time for the page to load
    time.sleep(20)

    # Perform scrolling and capture screenshots
    num_scrolls = 5
    for page_number in range(1, num_scrolls + 1):
        take_screenshot(driver, 'D:/FYP Phish', page_number)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

    # Close the browser
    driver.quit()

@app.route('/scan_website', methods=['POST'])
def scan_website():
    try:
        data = request.get_json()
        url = data['url']

        # Call the function to scan the website and take screenshots
        scroll_full_page_and_take_screenshots(url)

        # Return success response to the JSX code
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error during website scanning: {e}")
        return jsonify({'success': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5300)
