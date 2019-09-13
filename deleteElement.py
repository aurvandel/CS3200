import json

with open('2018boys.json', 'r') as data_file:
    data = json.load(data_file)

for element in data:
    element.pop('gender', None)
    element.pop('n', None)

newList = dict.items()

with open('dat1a.json', 'w') as data_file:
    data = json.dump(dict.items(), data_file)
