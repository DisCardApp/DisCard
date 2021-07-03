import json
with open('credit_card_info.json', 'r') as File:
    data = File.read()

json_file = json.loads(data)
print(json_file)