import json

with open('2018girls.json', 'r') as data_file:
    data = json.load(data_file)

for element in data:
    element.pop('gender', None)
    element.pop('n', None)

with open('girls.json', 'w') as data_file:
    data = json.dump(data, data_file)
