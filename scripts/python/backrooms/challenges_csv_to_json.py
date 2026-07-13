#!/usr/bin/env python3

import argparse
import csv
import json

"""
Sample input file format:
id,Challenge Name,Difficulty [1-4],Description,Creator,Notes
1,Hazard Removal,Lv1,Enter a Watery Corridor with at least 3 Hazards and Lose Sanity and Deck in Hand to discard a Hazard. ,NowayArtemus,
2,Vertical Escape,Lv1,"After entering the Spiral Staircase, spend the Sanity to place an engaged Entity into the Discard Pile.",NowayArtemus,
3,Murked,Lv1,Defeat an Entity while in the Murky Pool.,NowayArtemus,

Sample output file format:
{
    "id": 214,
    "name": "The Entity Next Door (L2)",
    "difficulty": 2,
    "description": "Whenever you lose DIH to an Entity while engaged, your Sanity drops by the same amount. Every engagement in this place drains both your mind and your body. Prepare yourself to suffer, but through suffering, find your salvation!",
    "creator": "BigTasty",
    "type": "GENERIC"
}

Example for running script:
python3 challenges_csv_to_json.py data/challenges/temp1.csv data/challenges/output.json --start-id 252 --difficulty 3 --type AQUA_ZONE
"""


def main():
    parser = argparse.ArgumentParser(
        description="Convert challenge CSV to JSON."
    )

    parser.add_argument("input_csv", help="Input CSV file")
    parser.add_argument("output_json", help="Output JSON file")

    parser.add_argument(
        "--start-id",
        type=int,
        required=True,
        help="Starting ID for generated JSON objects",
    )

    parser.add_argument(
        "--difficulty",
        type=int,
        required=True,
        help="Difficulty value to use for every record",
    )

    parser.add_argument(
        "--type",
        required=True,
        help="Type value to use for every record",
    )

    args = parser.parse_args()

    output = []
    next_id = args.start_id

    with open(args.input_csv, newline="", encoding="utf-8-sig") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            output.append({
                "id": next_id,
                "name": f"{row['Challenge Name']} ({row['Difficulty [1-4]']})",
                "difficulty": args.difficulty,
                "description": row["Description"].strip(),
                "creator": row["Creator"].strip(),
                "type": args.type
            })

            next_id += 1

    with open(args.output_json, "w", encoding="utf-8") as jsonfile:
        json.dump(output, jsonfile, indent=4, ensure_ascii=False)

    print(f"Wrote {len(output)} records to {args.output_json}")


if __name__ == "__main__":
    main()