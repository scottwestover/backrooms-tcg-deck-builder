import os
import utils
import time
from PIL import Image


def download_images_from_links(card_links: list[str]):
  card_image_dir = './data/images'
  for index, card_link in enumerate(card_links):
    file_name = card_image_dir + str(index) + '.png'
    utils.download_image_with_retry(card_link, file_name)
    time.sleep(0.25)


def convert_image_to_webp():
  card_image_dir = './data/images/'
  file_list = os.listdir(card_image_dir + 'promo')
  for file_name in file_list:
    im = Image.open(card_image_dir + 'promo/' + file_name).convert('RGBA')
    im.save(card_image_dir + file_name[:-4] + '.webp', 'webp')


if __name__ == "__main__":
  # attempt to load links from cached json file
  card_links = utils.load_links()

  # if no cached links found, fetch new links
  if (len(card_links) == 0):
    card_links = utils.get_links()
    utils.save_links(card_links)

  # attempt to download images from the provided links
  # download_images_from_links(card_links)

  # modify each image file from png to webp file
  # convert_image_to_webp()

  utils.create_cards_json()
