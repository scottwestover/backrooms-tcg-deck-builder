import csv
import json
import os
import re

def parse_difficulty(difficulty_str):
    """Extracts the first digit from a difficulty string, defaults to 1."""
    if not difficulty_str:
        return 1
    match = re.search(r'\d', difficulty_str)
    if match:
        return int(match.group())
    return 1

def process_csv_files():
    """
    Parses challenge CSV files and generates a single JSON file.
    Logs any rows that could not be parsed.
    """
    base_path = os.path.dirname(__file__)
    data_path = os.path.join(base_path, 'data', 'challenges')
    output_path = os.path.abspath(os.path.join(base_path, '..', '..', '..', 'src', 'assets', 'randomizer', 'challenges.json'))
    error_log_path = os.path.join(base_path, 'challenge_errors.txt')

    files_to_process = {
        'challenges.csv': 'GENERIC',
        'Backrooms TCG Community Challenge Sheet - Car Park Level Challenges.csv': 'CAR_PARK',
        'Backrooms TCG Community Challenge Sheet - Lobby Levels Challenges.csv': 'LOBBY_LEVEL'
    }

    all_challenges = []
    errors = []
    current_id = 1

    for filename, challenge_type in files_to_process.items():
        filepath = os.path.join(data_path, filename)
        print(f"Processing {filepath}...")

        try:
            with open(filepath, mode='r', encoding='utf-8') as infile:
                reader = csv.reader(infile)
                next(reader)  # Skip header row

                last_challenge_name = ""
                for row in reader:
                    # Skip empty rows or separator rows
                    if not any(field.strip() for field in row):
                        continue
                    if row[2].strip().startswith('Level'):
                        continue

                    name = row[1].strip().strip('"')
                    description = row[3].strip()

                    # Handle multi-line challenges like "Time Trial"
                    if not name and description:
                        name = last_challenge_name
                    elif name:
                        last_challenge_name = name
                    
                    difficulty_str = row[2].strip()
                    creator = row[4].strip()

                    # Validate essential fields
                    if not name or not description or not creator:
                        errors.append(f"Invalid Row in {filename}: {row}")
                        continue

                    challenge = {
                        'id': current_id,
                        'name': name,
                        'difficulty': parse_difficulty(difficulty_str),
                        'description': description,
                        'creator': creator,
                        'type': challenge_type
                    }
                    all_challenges.append(challenge)
                    current_id += 1

        except FileNotFoundError:
            error_msg = f"File not found: {filepath}"
            print(error_msg)
            errors.append(error_msg)
        except Exception as e:
            error_msg = f"An error occurred processing {filepath}: {e}"
            print(error_msg)
            errors.append(error_msg)

    # Write the successfully parsed challenges to JSON
    try:
        with open(output_path, 'w', encoding='utf-8') as outfile:
            json.dump(all_challenges, outfile, indent=4)
        print(f"\nSuccessfully wrote {len(all_challenges)} challenges to {output_path}")
    except Exception as e:
        print(f"Error writing to JSON file: {e}")

    # Write any errors to the log file
    if errors:
        try:
            with open(error_log_path, 'w', encoding='utf-8') as error_file:
                for error in errors:
                    error_file.write(f"{error}\n")
            print(f"Found {len(errors)} issues. Please review {error_log_path}")
        except Exception as e:
            print(f"Error writing to error log file: {e}")

if __name__ == '__main__':
    process_csv_files()
