# Baby Name Generator

## Resource

**Baby Names**

Attributes:

* name (string)
* gender (string)
* n (integer) (Number of people with the name)
* rank (integer) (Popularity)
* origin (string)
* fav (integer) (used as bool value to denote favorites)

## Schema

```sql
CREATE TABLE baby_names (
id INTEGER PRIMARY KEY,
name TEXT,
gender TEXT NULL,
n INT NULL,
rank INT NULL,
origin TEXT DEFAULT NULL,
fav INTEGER DEFAULT 0);
```

## REST Endpoints

Name                           			| Method | Path
----------------------------------------|--------|------------------
Retrieve girl names collection 			| GET    | /girlNames
Retrieve favorite girl names collection | GET    | /favGirlNames
Retrieve boy names collection 			| GET    | /boyNames
Retrieve favorite boy names collection	| GET    | /favBoyNames
Retrieve favorite boy name member       | GET    | /favBoyNames/*\<id\>*
Retrieve favorite girl name member      | GET    | /favGirlNames/*\<id\>*
Create favorite boy name member         | POST   | /favBoyNames
Create favorite girl name member        | POST   | /favGirlNames
Update favorite boy name member         | PUT    | /favBoyNames/*\<id\>*
Update favorite girl name member        | PUT    | /favGirlNames/*\<id\>*
Delete favorite boy name member         | DELETE | /favBoyNames/*\<id\>*
Delete favorite girl name member        | DELETE | /favGirlNames/*\<id\>*
