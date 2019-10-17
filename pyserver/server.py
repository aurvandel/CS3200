#!/usr/bin/env python3
#built in http stuff
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import json
from namesDB import NamesDB


class MyRequestHandler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def handleNamesRetrieveCollection(self, gender, fav):
        # send_response(status code, )
        self.send_response(200)
        # send the header data send_header(key, value)
        self.send_header("Content-Type", "application/json")
        # have to call end_headers to finish the response
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        # send body
        db = NamesDB()
        names = db.getNames(gender, fav)
        self.wfile.write(bytes(json.dumps(names), "utf-8"))
        
    def handleNamesRetrieveMember(self):
        #print(self.path)
        parts = self.path.split("/")
        nameID = parts[-1]
        db = NamesDB()
        name = db.getOneName(nameID)
        if name != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(name), "utf-8"))
        else:
            self.send404()

    def send404(self):
        print(self.path)
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(bytes("Unable to locate " + self.path, "utf-8"))

    def do_GET(self):
        # print("The PATH is:", self.path )

        if self.path == "/girlNames":
            self.handleNamesRetrieveCollection('F', 0)
                    
        elif self.path == "/favGirlNames":
            self.handleNamesRetrieveCollection("F", 1)

        elif self.path == "/boyNames":
            self.handleNamesRetrieveCollection("M", 0)

        elif self.path == "/favBoyNames":
            self.handleNamesRetrieveCollection("M", 1)

        # retrieve one name from the collection
        elif self.path.startswith("/favBoyNames/"):
            self.handleNamesRetrieveMember()

        elif self.path.startswith("/favGirlNames/"):
            self.handleNamesRetrieveMember()
            
        else:
            self.send404()

    def handleCreateName(self):
        length = self.headers["Content-Length"]
        # read the body (data)
        body = self.rfile.read(int(length)).decode("utf-8")
        parsed_body = parse_qs(body)        #decodes encoded data
        name = parsed_body["name"][0]
        gender = parsed_body["gender"][0]
        n = parsed_body["n"][0]
        rank = parsed_body["rank"][0]
        origin = parsed_body["origin"][0]
        fav = parsed_body["fav"][0]
        db = NamesDB()
        db.insertName(name, gender, n, rank, origin, fav)

        # respond to the client
        self.send_response(201)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_POST(self):
        if self.path == "/favBoyNames":
            self.handleCreateName()

        elif self.path == "/favGirlNames":
            self.handleCreateName()

        elif self.path == "/newName":
            self.handleCreateName()

        else:
            self.send404()

    def do_DELETE(self):
        if self.path.startswith("/girlNames/"):
            parts = self.path.split("/")
            nameID = parts[-1]
            db = NamesDB()
            name = db.getOneName(nameID)
            if name != None:
                self.send_response(200)
                db.deleteOneName(nameID)
            else:
                self.send404()



def run():
    #listen(local IP, port)
    listen = ('127.0.0.1', 8080)
    #instatiate class to start HTTPServer
    #HTTPServer(listen object, RequestHandler Class(Not an object))
    server = HTTPServer(listen, MyRequestHandler)

    #Make sure we know that the server is running
    print("Listening....")
    #Tell the server to run
    server.serve_forever()


run()
