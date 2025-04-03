import os
import utils
import time
from PIL import Image

if __name__ == "__main__":
  # attempt to load links from cached json file
  card_links = utils.load_links()

  # if no cached links found, fetch new links
  if (len(card_links) == 0):
    card_links = utils.get_links()
    utils.save_links(card_links)

  # attempt to download images from the provided links
  card_image_dir = './data/images/'
  # for index, card_link in enumerate(card_links):
  #   file_name = card_image_dir + str(index) + '.png'
  #   utils.download_image_with_retry(card_link, file_name)
  #   time.sleep(0.25)

  # modify each image file from png to webp file
  file_list = os.listdir(card_image_dir + 'lost_levels')
  for file_name in file_list:
    # file_name = card_image_dir + 'CP-001.png'
    im = Image.open(card_image_dir + 'lost_levels/' + file_name).convert('RGBA')
    im.save(card_image_dir + file_name[:-4] + '.webp', 'webp')
