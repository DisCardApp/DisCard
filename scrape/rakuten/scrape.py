"""
MIT License

Copyright (c) 2021 Timothy Zheng, Eric Ji, Katherine Li, Sean Gordon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

from bs4 import BeautifulSoup
import json
import os
import requests

def scrape_rakuten():
    data = []
    user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'  # rate limit
    headers = {'User-Agent': user_agent}

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
        url = f'https://www.rakuten.ca/{link["data-store-url"]}'
        info[i].append(url)
        i += 1

    # Cashback
    i = 0
    for cashback in soup.find_all(attrs={"class":"now_rebate prox-b f-15 lh-22 cb"}):
        # print(cashback.get_text())
        info[i].append(cashback.get_text().strip())
        i += 1

    data = {}
    data['stores'] = {}
    alphanumeric = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for k in range(len(info)):
        name_key = []
        for char in info[k][0].lower():
            if char in alphanumeric:
                name_key.append(char)
            elif char == " " or char == "-":
                name_key.append("_")
        key = "".join(name_key)
        data['stores'][key] = {}
        data['stores'][key]['name'] = info[k][0]
        data['stores'][key]['image'] = info[k][1]
        data['stores'][key]['link'] = info[k][2]
        data['stores'][key]['cashback'] = info[k][3]

    with open('../../site/resource/rakuten.json', 'w') as out:
        out.write(json.dumps(data, indent=4))

