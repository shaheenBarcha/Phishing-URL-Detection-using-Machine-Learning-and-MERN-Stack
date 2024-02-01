from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import os
import time
import pyautogui

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
        take_screenshot(driver, 'D:/FYP Phish', page_number)
        pyautogui.press('pagedown')
        time.sleep(2)

    # Close the browser
    driver.quit()

# Ask the user to input the URL
url_input = input("Enter the URL: ")

# Open similarweb.com with the provided URL, scroll down, take screenshots, and close the browser
scroll_full_page_and_take_screenshots(url_input)
