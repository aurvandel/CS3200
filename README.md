# Baby Name Generator

## Resource

**Baby Names**

Attributes:

### Table: baby_names 
* name (string)
* gender (string)
* n (integer) (Number of people with the name)
* rank (integer) (Popularity)
* origin (string)
* fav (integer) (used as bool value to denote favorites)

### Table: users
* last_name (string)
* first_name (string)
* email (string)
* encrypted_password (string)

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

```sql
CREATE TABLE users (
id INTEGER PRIMARY KEY,
last_name TEXT NOT NULL,
first_name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
encrypted_password TEXT NOT NULL,
CONSTRAINT email_check CHECK (email LIKE "%_@___%")
);
```

## Password Hashing
Password is hashed and salted using python's bcrypt library

## REST Endpoints

Name                           		    	| Method | Path
----------------------------------------|--------|------------------
Retrieve girl names collection 		    | GET    | /girlNames
Retrieve favorite girl names collection | GET    | /favGirlNames
Retrieve boy names collection 		    | GET    | /boyNames
Retrieve favorite boy names collection	| GET    | /favBoyNames
Retrieve favorite boy name member       | GET    | /favBoyNames/*\<id\>*
Retrieve favorite girl name member      | GET    | /favGirlNames/*\<id\>*
Create favorite boy name member         | POST   | /favBoyNames
Create favorite girl name member        | POST   | /favGirlNames
Create a new user				        | POST   | /users
Create a new session			        | POST   | /sessions
Check if session exists (logged in)     | PUT	 | /sessions
Update favorite boy name member         | PUT    | /favBoyNames/*\<id\>*
Update favorite girl name member        | PUT    | /favGirlNames/*\<id\>*
Delete favorite boy name member         | DELETE | /favBoyNames/*\<id\>*
Delete favorite girl name member        | DELETE | /favGirlNames/*\<id\>*
