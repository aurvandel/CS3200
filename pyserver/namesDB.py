#!/usr/bin/env python3
import sqlite3


class NamesDB:
    def __init__(self):
        # connects to db
        self.connection = sqlite3.connect("namesdb.db")
        # where you are at in the db (iterator)
        self.cursor = self.connection.cursor()

    #insert
    def insertToDB(self, name):
        data = [name]
        self.cursor.execute("INSERT INTO test (name) VALUES (?)", data)
        self.connection.commit()

    def getNames(self):
        # shows it as a list of tuples. need to change to a list of dicts
        self.cursor.execute("SELECT * FROM test")
        result = self.cursor.fetchall()
        return result


insertToDB("test again")
