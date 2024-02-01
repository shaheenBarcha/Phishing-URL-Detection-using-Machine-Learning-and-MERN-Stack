from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import os
import time
import pyautogui
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def take_screenshot(driver, screenshot_directory, page_number):
    # Take a screenshot and save it to the specified directory
    screenshot_path = os.path.join(screenshot_directory, f'similarweb_screenshot_{page_number}.png')
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot {page_number} taken and saved: {screenshot_path}")

def scroll_full_page_and_take_screenshots(url):
    # Set Chrome options for running with a minimized window
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--start-minimized")

    # Initialize the Chrome WebDriver
    driver = webdriver.Chrome(options=chrome_options)

    # Open similarweb.com with the user-provided URL
    driver.get(f"https://www.similarweb.com/website/{url}")

    # Wait for 20 seconds to give time for the page to load
    time.sleep(20)

    # Perform scrolling and capture screenshots
    num_scrolls = 5
    for page_number in range(1, num_scrolls + 1):
        take_screenshot(driver, 'E:\FYPPhish', page_number)
        pyautogui.press('pagedown')
        time.sleep(2)

    # Close the browser
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

    # Extracting the Alexa rank
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

if __name__ == "__main__":
    user_url = input("Enter the URL: ")

    # Validate and modify the URL format if needed
    if not user_url.startswith(('http://', 'https://')):
        user_url = f"https://{user_url}"

    parsed_url = urlparse(user_url)
    domain = parsed_url.netloc

    # Open similarweb.com with the provided URL, scroll down, take screenshots, and close the browser
    scroll_full_page_and_take_screenshots(domain)

    alexa_rank = get_alexa_rank(domain)

    if alexa_rank:
        print(f"\nAlexa Rank: {alexa_rank}")
    else:
        print("Alexa Rank: Not Available")