import json
with open('credit_card_info.json', 'r') as File:
    data = File.read()

json_file = json.loads(data)
stores = []
for key in json_file:
    if json_file[key]['points']['store_specific']:
        for store in json_file[key]['points']['store_specific']:
            if store not in stores:
                stores.append(store)
stores.sort()
for store in stores:
    print(store)