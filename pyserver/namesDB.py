#!/usr/bin/env python3
import sqlite3


#from row factory, converts list of tuples to json
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class NamesDB:
    def __init__(self):
        # connects to db
        self.connection = sqlite3.connect("namesdb.db")
        # converts list of tuples to json data
        self.connection.row_factory = dict_factory
        # where you are at in the db (iterator)
        self.cursor = self.connection.cursor()


    #insert
    def insertName(self, name, gender, n, rank, origin, fav):
        data = [name, gender, n, rank, origin, fav]
        self.cursor.execute("INSERT INTO baby_names (name, gender, n, rank, origin, fav) VALUES (?,?,?,?,?,?)", data)
        self.connection.commit()

    # might need a bulk get and a more specific get method like this one
    def getNames(self, gender, fav):
        # shows it as a list of tuples. need to change to a list of dicts
        data = [gender, fav]
        self.cursor.execute("SELECT * FROM baby_names WHERE gender IS ? AND fav IS ?", data)
        result = self.cursor.fetchall()
        return result


    # need an update and delete method