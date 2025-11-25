
import json

file_path = 'src/assets/cardlists/wip.json'

with open(file_path, 'r') as f:
    data = json.load(f)

# The default separators for json.dump are (', ', ': ').
# To make it more compact, we can use (',', ':')
# However, to put each object on a single line, we need to iterate and dump each object individually
# or rely on the default behavior for lists of objects.
# The request is to make the *objects* themselves single line, not necessarily the entire list.
# json.dumps with no indent will make everything as compact as possible.

# Re-dumping the entire structure with no indentation will achieve the desired single-line object format.
# We will then write this compact string back to the file.

compact_json_string = json.dumps(data, indent=None, separators=(',', ':'))

with open(file_path, 'w') as f:
    f.write(compact_json_string)

print('Successfully reformatted wip.json to single-line card objects.')
