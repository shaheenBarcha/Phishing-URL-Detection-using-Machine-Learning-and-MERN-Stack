import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

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
    user_url = input("Enter the URL you want to check: ")

    # Validate and modify the URL format if needed
    if not user_url.startswith(('http://', 'https://')):
        user_url = f"https://{user_url}"

    parsed_url = urlparse(user_url)
    domain = parsed_url.netloc

    alexa_rank = get_alexa_rank(domain)

    if alexa_rank:
        print(f"\nAlexa Rank: {alexa_rank}")
    else:
        print("Alexa Rank: Not Available")
