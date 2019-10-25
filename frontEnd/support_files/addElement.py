import json

with open('2018names.json', 'r') as data_file:
    data = json.load(data_file)

girlRank = 1
boyRank = 1
for element in data:
    if element['gender'] == 'F':
        element['rank'] = girlRank
        girlRank += 1
    
    elif element['gender'] == 'M':
        element['rank'] = boyRank
        boyRank += 1
    element['origin'] = None


        
#for element in data:
#    element.pop('gender', None)
#    element.pop('n', None)
#
with open('2018all.json', 'w') as data_file:
    data = json.dump(data, data_file)
