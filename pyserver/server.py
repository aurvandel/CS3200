#!/usr/bin/env python3
#built in http stuff
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import json
from passlib.hash import bcrypt
#from os import curdir, sep

from namesDB import NamesDB

class MyRequestHandler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        # print("The PATH is:", self.path )
        #files = ["/index.html", "/style.css", "/app.js", "/background.jpg"]

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

        '''
        elif self.path in files:
            """Handles routing for the application's entry point'"""

            try:
                #Check the file extension required and
                #set the right mime type

                sendReply = False
                if self.path.endswith(".html"):
                    mimetype='text/html'
                    sendReply = True
                if self.path.endswith(".jpg"):
                    mimetype='image/jpg'
                    sendReply = True
                if self.path.endswith(".gif"):
                    mimetype='image/gif'
                    sendReply = True
                if self.path.endswith(".js"):
                    mimetype='application/javascript'
                    sendReply = True
                if self.path.endswith(".css"):
                    mimetype='text/css'
                    sendReply = True

                if sendReply == True:
                    #Open the static file requested and send it
                    filename = "../frontEnd" + self.path
                    f = open(filename)
                    self.send_response(200)
                    self.send_header('Content-type',mimetype)
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(bytes(f.read(), "utf-8"))
                    f.close()

                return

            except IOError:
                self.send404
            '''

    def do_PUT(self):
        if self.path.startswith("/favBoyNames/") or self.path.startswith("/favGirlNames/"):
            self.handleUpdateName()

        else:
            self.send404()

    def do_POST(self):
        if self.path == "/favBoyNames":
            self.handleCreateName()

        elif self.path == "/favGirlNames":
            self.handleCreateName()

        elif self.path == "/users":
            self.handleCreateUser()

        else:
            self.send404()

    def do_DELETE(self):
        if self.path.startswith("/favGirlNames/") or self.path.startswith("/favBoyNames/"):
            parts = self.path.split("/")
            nameID = parts[-1]
            db = NamesDB()
            name = db.getOneName(nameID)
            if name != None:
                db.deleteOneName(nameID)
                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
            else:
                self.send404()

        else:
            self.send404()

    def handleCreateUser(self):
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        parsed_body = parse_qs(body)        #decodes encoded data
        fname = parsed_body["fname"][0]
        lname = parsed_body["lname"][0]
        email = parsed_body["email"][0]
        password = parsed_body["password"][0]
        
        # Encrypt the password
        encryptedPassword = bcrypt.hash(password)
        
        db = NamesDB()
        db.insertUser(fname, lname, email, encryptedPassword)
        
        self.send_response(201)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

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

    def handleUpdateName(self):
        parts = self.path.split("/")
        nameID = parts[-1]
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
        nameFound = db.getOneName(nameID)
        if nameFound != None:
            db.updateName(nameID, name, gender, n, rank, origin, fav)

            # respond to the client
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.send404()

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


def run():
    try:
        #listen(local IP, port)
        listen = ('127.0.0.1', 8080)
        #listen = ('192.168.2.3', 8080)
        #instatiate class to start HTTPServer
        #HTTPServer(listen object, RequestHandler Class(Not an object))
        server = HTTPServer(listen, MyRequestHandler)

        #Make sure we know that the server is running
        print("Listening....")
        #Tell the server to run
        server.serve_forever()

    except KeyboardInterrupt:
        print(' received, shutting down the web server')
        server.socket.close()


run()
