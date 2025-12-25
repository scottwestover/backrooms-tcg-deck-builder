import json
import re
import os
import argparse
from difflib import SequenceMatcher

def similar(a, b):
    """Calculate the similarity ratio between two strings."""
    return SequenceMatcher(None, a, b).ratio()

def normalize_text(text):
    """Normalize text by lowercasing and removing extra whitespace."""
    return re.sub(r'\s+', ' ', text).strip().lower()

def normalize_name(name):
    """Normalize challenge name by removing level indicators."""
    return normalize_text(re.sub(r'\s*\(?lv?l?\s*\d+\)?', '', name))

def parse_challenge_line(line, current_type):
    """Parse a line from the categorized challenge text file section."""
    match = re.match(r'^Lv(\d+)\s*-\s*(.*?)\s*-\s*(.*)', line)
    if not match:
        return None

    difficulty = int(match.group(1))
    name = match.group(2).strip()
    description = match.group(3).strip()

    author_match = re.search(r'\((.*?)\)$', description)
    author = "Unknown"
    if author_match:
        author = author_match.group(1).strip()
        description = description[:author_match.start()].strip()

    return {
        "name": name,
        "difficulty": difficulty,
        "description": description,
        "creator": author,
        "type": current_type
    }

def parse_alphabetized_line(line):
    """Parse a line from the alphabetized challenge text file section."""
    match = re.match(r'^(.*?)\s*\((.*?)\s*–\s*Lv(\d+)\)\s*–\s*(.*)', line)
    if not match:
        return None

    name = match.group(1).strip()
    type_str = match.group(2).strip()
    difficulty = int(match.group(3))
    description = match.group(4).strip()

    type_map = {
        "generic": "GENERIC",
        "lobby level": "LOBBY_LEVEL",
        "car park level": "CAR_PARK"
    }
    challenge_type = type_map.get(type_str.lower(), "GENERIC")

    return {
        "name": name,
        "difficulty": difficulty,
        "description": description,
        "creator": "Unknown",
        "type": challenge_type
    }

def parse_new_format_line(line):
    """Parse a line from the new format (main2.txt) challenge text file section."""
    # Example: (Lobby Level) Lv 2 - Evolving Horrors (Lv 2) (NowayArtemus): SETUP: ...
    match = re.match(r'^\((.*?)\)\s*Lv\s*(\d+)\s*-\s*(.*?)(?:\s*\((.*?)\))?:\s*(.*)', line)
    if not match:
        return None

    type_str = match.group(1).strip()
    difficulty = int(match.group(2))
    name = match.group(3).strip()
    author_in_name = match.group(4) # This might be part of the name or an author
    description = match.group(5).strip()

    # Further parse name for potential author at the end
    author = "Unknown"
    name_parts = name.split('(')
    if len(name_parts) > 1 and name_parts[-1].endswith(')'):
        potential_author = name_parts[-1][:-1].strip()
        # Check if it looks like an author (e.g., not just a level indicator)
        if not re.match(r'Lv\s*\d+', potential_author, re.IGNORECASE):
            author = potential_author
            name = '('.join(name_parts[:-1]).strip()

    # If author was found in the main regex group 4
    if author_in_name:
        author_match_in_name = re.match(r'^(.*?)\s*\((.*?)\)$', author_in_name)
        if author_match_in_name:
            author = author_match_in_name.group(2).strip()
            # The name might have included the (Lv X) part, so re-evaluate name
            name = name.replace(author_in_name, '').strip()
        else:
            # If it's just a level indicator like (Lv 2), ignore it for author
            if not re.match(r'Lv\s*\d+', author_in_name, re.IGNORECASE):
                author = author_in_name.strip()


    type_map = {
        "generic": "GENERIC",
        "lobby level": "LOBBY_LEVEL",
        "car park level": "CAR_PARK"
    }
    challenge_type = type_map.get(type_str.lower(), "GENERIC")

    return {
        "name": name,
        "difficulty": difficulty,
        "description": description,
        "creator": author,
        "type": challenge_type
    }


def main():
    """Main function to process challenges."""
    parser = argparse.ArgumentParser(description="Process challenge text files and compare with existing JSON.")
    parser.add_argument("input_file", nargs='?', default="main.txt",
                        help="The input text file to process (e.g., main.txt, main2.txt). Defaults to main.txt.")
    args = parser.parse_args()

    root_dir = "/Users/swestover/Documents/github/personal/backrooms-tcg-deck-builder"
    txt_path = os.path.join(root_dir, "scripts/python/backrooms/data/challenges", args.input_file)
    json_path = os.path.join(root_dir, "src/assets/randomizer/challenges.json")
    output_dir = os.path.join(root_dir, "scripts/python/backrooms/data/challenges")

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            existing_challenges = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_path} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {json_path}.")
        return

    existing_challenges_lookup = {}
    for challenge in existing_challenges:
        name = normalize_name(challenge['name'])
        type_ = challenge.get('type', 'GENERIC').upper().replace("_", " ")
        existing_challenges_lookup[(name, type_)] = challenge

    new_challenges_from_txt = []
    parsed_from_txt_lookup = set()
    current_type = "GENERIC"
    parsing_mode = 'categorized' # 'categorized', 'alphabetized', 'new_format'

    try:
        with open(txt_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue

                # Detect parsing mode based on content
                if 'alphabetized challenge list' in line.lower():
                    parsing_mode = 'alphabetized'
                    continue
                # Check for the new format's distinct pattern
                if re.match(r'^\((.*?)\)\s*Lv\s*\d+\s*-\s*', line):
                    parsing_mode = 'new_format'
                    # For new_format, type is part of the line, so current_type is not needed
                elif parsing_mode != 'alphabetized': # If not alphabetized and not new format, assume categorized
                    parsing_mode = 'categorized'


                parsed = None
                if parsing_mode == 'categorized':
                    if line.lower() == 'generic':
                        current_type = "GENERIC"
                        continue
                    if line.lower() == 'lobby level':
                        current_type = "LOBBY_LEVEL"
                        continue
                    if line.lower() == 'car park level':
                        current_type = "CAR_PARK"
                        continue
                    parsed = parse_challenge_line(line, current_type)
                elif parsing_mode == 'alphabetized':
                    parsed = parse_alphabetized_line(line)
                elif parsing_mode == 'new_format':
                    parsed = parse_new_format_line(line)


                if parsed:
                    norm_name = normalize_name(parsed['name'])
                    norm_type = parsed['type'].upper().replace("_", " ")
                    if (norm_name, norm_type) not in parsed_from_txt_lookup:
                        new_challenges_from_txt.append(parsed)
                        parsed_from_txt_lookup.add((norm_name, norm_type))

    except FileNotFoundError:
        print(f"Error: {txt_path} not found.")
        return

    new_challenges = []
    duplicate_challenges = []
    unsure_challenges = []

    for new_challenge in new_challenges_from_txt:
        norm_name = normalize_name(new_challenge['name'])
        norm_type = new_challenge['type'].upper().replace("_", " ")
        lookup_key = (norm_name, norm_type)
        existing_challenge = existing_challenges_lookup.get(lookup_key)

        if existing_challenge:
            norm_desc_new = normalize_text(new_challenge['description'])
            norm_desc_existing = normalize_text(existing_challenge['description'])
            similarity_ratio = similar(norm_desc_new, norm_desc_existing)
            comparison_data = {
                "new_challenge": new_challenge,
                "existing_challenge": existing_challenge,
                "description_similarity": similarity_ratio
            }
            if similarity_ratio > 0.95:
                duplicate_challenges.append(comparison_data)
            else:
                unsure_challenges.append(comparison_data)
        else:
            new_challenges.append(new_challenge)

    os.makedirs(output_dir, exist_ok=True)
    with open(os.path.join(output_dir, 'new_challenges.json'), 'w', encoding='utf-8') as f:
        json.dump(new_challenges, f, indent=4)
    with open(os.path.join(output_dir, 'duplicate_challenges.json'), 'w', encoding='utf-8') as f:
        json.dump(duplicate_challenges, f, indent=4)
    with open(os.path.join(output_dir, 'unsure_challenges.json'), 'w', encoding='utf-8') as f:
        json.dump(unsure_challenges, f, indent=4)

    print(f"Processed {len(new_challenges_from_txt)} unique challenges from the text file.")
    print(f"Found {len(new_challenges)} new challenges.")
    print(f"Found {len(duplicate_challenges)} duplicate challenges.")
    print(f"Found {len(unsure_challenges)} unsure challenges.")
    print(f"Results saved in {output_dir}")

if __name__ == "__main__":
    main()
