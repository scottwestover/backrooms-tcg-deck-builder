import os
import json
import requests
from bs4 import BeautifulSoup
import urllib.request

"""
Gets all of the card links from the backrooms tcg website (card gallery).
"""
def get_links() -> list[str]:
  card_gallery_url = 'https://www.backroomstcg.com/pages/tcg-gallery'
  page = requests.get(card_gallery_url)
  soup = BeautifulSoup(page.content, "html.parser")

  # Get all card links from the Wiki
  main_content = soup.find('main', id='MainContent')
  main_content_links = main_content.find_all('a')

  card_links = []

  # Filter Card Links for all <a></a> tags
  for card_link in main_content_links:
    modified_link = 'https:' + card_link['data-img'][:-1]
    card_links.append(modified_link)

  return card_links


"""
Save the provided list of links into the 'links.json' file.
"""
def save_links(links: list[str]):
  # Open the JSON file and load its contents
  with open('./data/links.json', 'r') as file:
    data = json.load(file)

    # Add all new Links to the Array
    for link in links:
      if link not in data:
        data.append(link)

    # Save the Links to a JSON file
    with open('./data/links.json', 'w') as file:
      json.dump(data, file, indent=2)


"""
Loads the saved image links from the JSON file.
"""
def load_links() -> list[str]:
  with open('./data/links.json', 'r') as file:
    data = json.load(file)
    return data


"""
Downloads the provided image using the provided url.
"""
def download_image_with_retry(url: str, save_directory: str, max_retries=5, retry_delay=5):
  retries = 0

  while retries < max_retries:
    try:
      urllib.request.urlretrieve(url, save_directory)
      print(f"Downloaded image successfully.")
      return
    except urllib.error.HTTPError as e:
      if e.code == 503:
        print(
          f"HTTP Error 503: Service Unavailable. Retrying in {retry_delay} seconds...")
        retries += 1
        time.sleep(retry_delay)
      else:
        print(f"HTTP Error {e.code}: {e.reason}")
        break

  print("Failed to download the image after multiple attempts.")


def create_card_template_json(card_set: str, card_set_id: str, id: str):
  card = {
    "id": card_set + "-" + id,
    "name": {
      "english": "TODO"
    },
    "rarity": "HYPER",
    "types": [],
    "ccs": {
      "type": "",
      "value": ""
    },
    "navigationPoints": "",
    "sanityPoints": "",
    "attackDamage": "",
    "health": "",
    "cardImage": "assets/images/cards/lost-level/" + card_set + "-" + id + ".webp",
    "illustrator": "-",
    "cardNumber": card_set_id + id,
    "notes": "-",
    "version": "Normal",
    "cardType": "Entity"
  }
  return card


"""
Used to create the new cards json file for a given set. This is based on the
card images that we have for the new set.

The function will grab all of the images in a directory, and based on those filenames,
create a new json entry for that card with the provided card id. Once all of
the files are parsed, the list will be saved to a json file.

To use the function, update the set information below:
example: instead of lost_levels, we can do car park like so, 'car_park', 'CP', and '2'.
"""
def create_cards_json():
  card_image_dir = './data/images/'
  # update 'lost_levels' with the folder of the set we are parsing files for
  file_list = os.listdir(card_image_dir + 'promo')
  cards = []
  for file_name in file_list:
    card_id = file_name[3] + file_name[4] + file_name[5]
    # update the template below to use the correct set identifier and set id
    # LL - Lost Levels, id = 1
    # CP - Car Park, id = 2
    # P - Promo, id = 3
    card = create_card_template_json('P', '1', card_id)
    cards.append(card)
  sorted_cards = sorted(cards, key=lambda x: x['cardNumber'])
  with open('./data/cards.json', 'w') as file:
    json.dump(sorted_cards, file, indent=2)
