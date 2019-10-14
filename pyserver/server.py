#!/usr/bin/env python3
#built in http stuff
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import json
from namesDB import NamesDB


class MyRequestHandler(BaseHTTPRequestHandler):

    def sendGETResponse(self, code):
        # send_response(status code, )
        self.send_response(code)
        # send the header data send_header(key, value)
        self.send_header("Content-Type", "application/json")
        # have to call end_headers to finish the response
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def send404(self):
        print(self.path)
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(bytes("Unable to locate " + self.path, "utf-8"))
        
    def do_GET(self):
        # print("The PATH is:", self.path )

        if self.path == "/girlNames":
            self.sendGETResponse(200)
            # send body
            db = NamesDB()
            fullGirls = db.getNames("F", 0)
            self.wfile.write(bytes(json.dumps(fullGirls), "utf-8"))

        elif self.path.startswith("/girlNames/"):
            parts = self.path.split("/")
            nameID = parts[-1]
            print(nameID)
            db = NamesDB()
            name = db.getName(nameID)
            if name != None:
                self.sendGETResponse(200)
                self.wfile.write(bytes(json.dumps(name), "utf-8"))
            else:
                self.send(404)

        elif self.path == "/favGirlNames":
            self.sendGETResponse(200)
            db = NamesDB()
            favGirls = db.getNames("F", 1)
            # send body
            self.wfile.write(bytes(json.dumps(favGirls), "utf-8"))

        elif self.path == "/boyNames":
            self.sendGETResponse(200)
            db = NamesDB()
            fullBoys = db.getNames("M", 0)
            # send body
            self.wfile.write(bytes(json.dumps(fullBoys), "utf-8"))

        elif self.path == "/favBoyNames":
            self.sendGETResponse(200)
            db = NamesDB()
            favBoys = db.getNames("M", 1)
            # send body
            self.wfile.write(bytes(json.dumps(favBoys), "utf-8"))

        else:
            self.send404()

    def handlePOST(self):
        length = self.headers["Content-Length"]
        # read the body (data)
        body = self.rfile.read(int(length)).decode("utf-8")
        parsed_body = parse_qs(body)        #decodes encoded data
        print(parsed_body)
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
            self.handlePOST()

        elif self.path == "/favGirlNames":
            self.handlePOST()

        elif self.path == "/newName":
            self.handlePOST()
            
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
