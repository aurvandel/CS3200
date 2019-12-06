#!/usr/bin/env python3
import os
import psycopg2
import psycopg2.extras
import urllib.parse


#from row factory, converts list of tuples to json
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class NamesDB:
    def __init__(self):
        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

        self.connection = psycopg2.connect(
            cursor_factory=psycopg2.extras.RealDictCursor,
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def createNamesTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS baby_names (id SERIAL PRIMARY KEY, name VARCHAR(255) NULL, gender VARCHAR(2) NULL, n INT NULL, rank INT NULL, origin VARCHAR(255) DEFAULT NULL, fav INTEGER DEFAULT 0);")
        self.connection.commit()
        #TODO: add check if table is empty then add names

    def createUsersTable(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, last_name VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, encrypted_password VARCHAR(255) NOT NULL);")
        self.connection.commit()
        
    #insert
    def insertName(self, name, gender, n, rank, origin, fav):
        data = [name, gender, n, rank, origin, fav]
        self.cursor.execute("INSERT INTO baby_names (name, gender, n, rank, origin, fav) VALUES (%s,%s,%s,%s,%s,%s)", data)
        self.connection.commit()

    # might need a bulk get and a more specific get method like this one
    def getNames(self, gender, fav):
        # shows it as a list of tuples. need to change to a list of dicts
        data = [gender, fav]
        self.cursor.execute("SELECT * FROM baby_names WHERE gender=%s AND fav=%s", data)
        result = self.cursor.fetchall()     #returns a list
        return result

    def getOneName(self, id):
        data = [id]
        self.cursor.execute("SELECT * FROM baby_names WHERE id = %s", data)
        result = self.cursor.fetchone()     #returns either 1 dictionary or None
        return result

    # need an update and delete method
    def deleteOneName(self, id):
        data = [id]
        self.cursor.execute("DELETE FROM baby_names WHERE id = %s", data)
        self.connection.commit()

    def updateName(self, id, name, gender, n, rank, origin, fav):
        data = [name, gender, n, rank, origin, fav, id]
        self.cursor.execute("UPDATE baby_names SET name=%s, gender=%s, n=%s, rank=%s, origin=%s, fav=%s WHERE id=%s", data)
        self.connection.commit()

    def insertUser(self, fname, lname, email, encryptedPassword):
        data = [lname, fname, email, encryptedPassword]
        self.cursor.execute("INSERT INTO users (last_name, first_name, email, encrypted_password) VALUES (%s,%s,%s,%s)", data)
        self.connection.commit()

    def getOneUser(self, email):
        data = [email]
        self.cursor.execute("SELECT * FROM users WHERE email = %s", data)
        result = self.cursor.fetchone()
        return result

    def getOneUserByID(self, uid):
        data = [uid]
        self.cursor.execute("SELECT * FROM users WHERE id = %s", data)
        result = self.cursor.fetchone()
        return result
