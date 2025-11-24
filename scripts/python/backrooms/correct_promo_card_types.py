
import json

file_path = 'src/assets/cardlists/promo-cards.json'

with open(file_path, 'r') as f:
    cards = json.load(f)

for card in cards:
    if 'cardType' in card and isinstance(card['cardType'], str):
        card['cardType'] = card['cardType'].capitalize()

with open(file_path, 'w') as f:
    json.dump(cards, f, indent=2)

print('Successfully updated card types in promo-cards.json')
