import csv
import json


def make_json(csvFilePath, jsonFilePath):
     
    # create a dictionary
    data = {}
     
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
         
        # Convert each row into a dictionary
        # and add it to data
        alphanumeric = 'abcdefghijklmnopqrstuvwxyz0123456789'
        for rows in csvReader:
            # Assuming a column named 'No' to
            # be the primary key
            bank = rows['Bank']
            card_name = eval(f"\"{rows['Credit Card']}\"")
            card_temp = []
            for char in card_name.lower():
                if char in alphanumeric:
                    card_temp.append(char)
                elif char == " ":
                    card_temp.append('_')
            card_var = "".join(card_temp)
            
            data[card_var] = {
                'bank': bank,
                'image': rows['Photo Direct Link'],
                'name': card_name,
                'type': rows['Points or Cashback?'],
                'point_type': rows['If Points, Type?'] if rows['If Points, Type?'].strip() != '' else False,
                'points': {
                    'general': float(rows['General Cashback'][:-1]) if rows['General Cashback'][:-1].strip() != '' else 0.00,
                    'restaurant': float(rows['Restaurants'][:-1]) if rows['Restaurants'][:-1].strip() != '' else 0.00,
                    'grocery': float(rows['Groceries'][:-1]) if rows['Groceries'][:-1].strip() != '' else 0.00,
                    'drug_store': float(rows['Drug Store'][:-1]) if rows['Drug Store'][:-1].strip() != '' else 0.00,
                    'gas': float(rows['Gas'][:-1]) if rows['Gas'][:-1].strip() != '' else 0.00,
                    'trave': float(rows['Travel'][:-1]) if rows['Travel'][:-1].strip() != '' else 0.00,
                    'entertainment': float(rows['Entertainment'][:-1]) if rows['Entertainment'][:-1].strip() != '' else 0.00,
                    'bill_payments': float(rows['Bill Payments'][:-1]) if rows['Bill Payments'][:-1].strip() != '' else 0.00,
                    'store_specific': {} if rows['Store'].strip() != '' else False                    
                }
            }
 
    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


make_json('Credit Card Database - Copy of Sheet1 (2).csv', 'credit_card_info.json')
