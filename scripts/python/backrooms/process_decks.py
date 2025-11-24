import json
import csv
import re
import io

def find_card_id(card_name, all_cards):
    cleaned_name = card_name.lower().strip()
    # Remove trailing commas
    cleaned_name = cleaned_name.strip(',')
    # Remove quantities and 'x' prefixes
    cleaned_name = re.sub(r'^\d+\s*x?\s*', '', cleaned_name)
    # Remove text in parentheses
    cleaned_name = re.sub(r'\(.*\)', '', cleaned_name).strip()
    # Remove text in brackets
    cleaned_name = re.sub(r'\[.*\]', '', cleaned_name).strip()
    # Remove quotes
    cleaned_name = cleaned_name.replace('“', '').replace('”', '')
    # Special replacements
    if 'december 2022 promo' in cleaned_name:
        cleaned_name = 'happy holidays'
    if "doll face jack" in cleaned_name:
        cleaned_name = "doll face's jack o'lantern"
    if 'bakteria' in cleaned_name:
        cleaned_name = 'baktéria'
    if 'mr freeman' in cleaned_name:
        cleaned_name = 'mr.freeman'
    if 'bsocs device' in cleaned_name:
        cleaned_name = 'b.s.c.o.s. device'
    if "jar o'bright" in cleaned_name:
        cleaned_name = "jar o'bright"
    if "jar o'dark" in cleaned_name:
        cleaned_name = "jar o'dark"
    if 'las doce uvas' in cleaned_name:
        cleaned_name = 'las doce uvas de la suerte'
    if 'electrofest balloon' in cleaned_name:
        cleaned_name = 'electrofest ballon'
    if 'punctured wall' in cleaned_name:
        return 'LL-007'
    if 'poison hall' in cleaned_name:
        return 'LL-008'
    if 'commander tomas' in cleaned_name:
        return 'LL-100'
    if 'clocksmith' in cleaned_name:
        return 'LL-054'
    if 'mr. freeman' in cleaned_name:
        return 'LL-050'
    if 'bscos device' in cleaned_name:
        return 'LL-022'
    if 'void' in cleaned_name:
        return 'LL-068'
    if 'liquid pan' in cleaned_name:
        return 'LL-023'
    if 'space portal' in cleaned_name:
        return 'LL-070'
    if 'false feast' in cleaned_name:
        return 'P-014'
    if 'electro-fest balloon' in cleaned_name:
        return 'P-018'
    if 'destroyed wall' in cleaned_name:
        return 'LL-005'
    if 'alia' in cleaned_name:
        return 'LL-101'
    if 'partygoers' in cleaned_name:
        return 'LL-034'
    if 'greener pastures' in cleaned_name:
        return 'LL-067'
    if 'cosmonaut tomac' in cleaned_name:
        return 'LL-053'
    if 'golden stairs' in cleaned_name:
        return 'LL-065'
    if 'painite wall' in cleaned_name:
        return 'LL-099'
    if 'ancient stranger' in cleaned_name:
        return 'LL-036'
    if 'bacteria' in cleaned_name:
        return 'LL-044'
    if 'conductor' in cleaned_name:
        return 'LL-045'


    for card in all_cards:
        if cleaned_name == card['name']['english'].lower().strip():
            return card['id']
    return f'TBD::{card_name}'

def parse_card_string(card_string, all_cards):
    cards = []
    lines = card_string.strip().splitlines()
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Try to parse with quantity at the beginning
        match = re.match(r'^(\d+)\s+(.*)', line)
        if match:
            qty = int(match.group(1))
            name = match.group(2).strip()
            card_id = find_card_id(name, all_cards)
            cards.append({'id': card_id, 'qty': qty})
            continue

        # Try to parse with quantity at the end (e.g. "Corner x5")
        match = re.match(r'^(.*)\s+x(\d+)', line)
        if match:
            qty = int(match.group(2))
            name = match.group(1).strip()
            card_id = find_card_id(name, all_cards)
            cards.append({'id': card_id, 'qty': qty})
            continue
        
        # Try to parse with quantity and name like `Corner 7`
        match = re.match(r'^(.*?)\s*(\d+)$', line)
        if match:
            qty = int(match.group(2))
            name = match.group(1).strip()
            if name:
                card_id = find_card_id(name, all_cards)
                cards.append({'id': card_id, 'qty': qty})
                continue

        # Assume quantity is 1 if no number is found
        card_id = find_card_id(line, all_cards)
        cards.append({'id': card_id, 'qty': 1})

    return cards

# Read all card data
with open('src/assets/cardlists/car-park-cards.json', 'r') as f:
    car_park_cards = json.load(f)
with open('src/assets/cardlists/lobby-level-cards.json', 'r') as f:
    lobby_level_cards = json.load(f)
with open('src/assets/cardlists/promo-cards.json', 'r') as f:
    promo_cards = json.load(f)

all_cards = promo_cards + lobby_level_cards + car_park_cards

# Read and process the CSV
with open('src/assets/cardlists/Backrooms TCG Community Deck List - Lobby Level Community Deck List (Backrooms TCG).csv', 'r') as f:
    csv_content = f.read()

# Use StringIO to handle the multi-line fields
csv_file = io.StringIO(csv_content)
reader = csv.DictReader(csv_file)
decks = {}

for row in reader:
    deck_name = row['Name']
    if not deck_name or deck_name.strip() == '' or row['#'] == '44':
        continue

    # Create a slug for the deck name
    deck_slug = ''.join(e for e in deck_name if e.isalnum()).lower()
    if not deck_slug:
        deck_slug = f'deck-{row["#"]}'

    # Handle special deck names
    if 'parties’ always greener' in deck_name.lower() and 'deck one' in deck_name.lower():
        deck_slug = 'thepartiesalwaysgreenerontheothersidedeckone'
    elif 'parties’ always greener' in deck_name.lower() and 'deck two' in deck_name.lower():
        deck_slug = 'thepartiesalwaysgreenerontheothersidedecktwo'


    decks[deck_slug] = {
        'name': deck_name,
        'rooms': parse_card_string(row['30 Room Cards'], all_cards),
        'entities': parse_card_string(row['10 Entity Cards'], all_cards),
        'items': parse_card_string(row['10 Item Cards'], all_cards),
        'outcomes': parse_card_string(row['2 Outcome Cards'], all_cards),
    }

# Write the output to wip.json
with open('src/assets/cardlists/wip.json', 'w') as f:
    json.dump(decks, f, indent=2)

print('Successfully created wip.json')