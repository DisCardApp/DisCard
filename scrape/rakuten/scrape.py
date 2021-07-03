from bs4 import BeautifulSoup
import requests
import json

data = []
user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'  # rate limit
headers = {'User-Agent': user_agent}
skipped = []
types = []

rakuten_link = 'https://www.rakuten.ca/stores'
source = requests.get(rakuten_link, headers=headers).text
soup = BeautifulSoup(source, "lxml")

info = []  # contains sublists of each store with store name, image, cashback amount, respectively

# Store name
for store in soup.find_all(attrs={"class":"store-name"}):
    info.append([store.get_text()])

# Store Image Link
i = 0
for img in soup.find_all(attrs={"class": "lazy", "height":"27px"}):
    # print(img["data-href"])
    info[i].append(img["data-href"])
    i += 1

# Link
i = 0
for link in soup.find_all(attrs={"data-gtm-action": "ShoppingTrip"}):
    info[i].append(link["data-store-url"])
    i += 1

# Cashback
i = 0
for cashback in soup.find_all(attrs={"class":"now_rebate prox-b f-15 lh-22 cb"}):
    # print(cashback.get_text())
    info[i].append(cashback.get_text().strip())
    i += 1


data = {}
data['stores'] = {}
for k in range(len(info)):
    data['stores'][info[k][0]] = {}
    data['stores'][info[k][0]]['name'] = info[k][0]
    data['stores'][info[k][0]]['image'] = info[k][1]
    data['stores'][info[k][0]]['link'] = info[k][2]
    data['stores'][info[k][0]]['cashback'] = info[k][3]

with open('rakuten.json', 'w') as out:
    out.write(json.dumps(data, indent=4))

