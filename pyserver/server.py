#!/usr/bin/env python3
#built in http stuff
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import json
from passlib.hash import bcrypt
from http import cookies
#from os import curdir, sep
from namesDB import NamesDB
from session_store import SessionStore

SESSION_STORE = SessionStore()      # has to outlive a request so it's global


class MyRequestHandler(BaseHTTPRequestHandler):

    def end_headers(self):
        self.send_cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        BaseHTTPRequestHandler.end_headers(self)

    def load_cookie(self):
        if "Cookie" in self.headers:
            self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
        else:
            self.cookie = cookies.SimpleCookie()

    def send_cookie(self):
        for morsel in self.cookie.values():
            self.send_header("Set-Cookie", morsel.OutputString())

    # load session into self.session
    def load_session(self):
        self.load_cookie()
        # if session id is in cookie
        if "sessionID" in self.cookie:
            #if session id in SessionStore
            sessionID = self.cookie["sessionID"].value
            # save the session for use later
            self.session = SESSION_STORE.getSession(sessionID)
            # if sessioid not is session store
            if self.session == None:
                # create new sessionID
                sessionID = SESSION_STORE.createSession()
                self.session = SESSION_STORE.getSession(sessionID)
                # put it in cookie
                self.cookie["sessionID"] = sessionID
        #otherwise, if sesion id is not in cookie
        else:
            #create a new sessions
            sessionID = SESSION_STORE.createSession()
            self.session = SESSION_STORE.getSession(sessionID)
            #set the new sesion id into the cookies
            self.cookie["sessionID"] = sessionID
        #print("sessionID: ", sessionID)

    def do_OPTIONS(self):
        self.load_session()
        self.send_response(200)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self.load_session()

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

        elif self.path == "/sessions":
            self.handleCheckSession()

        else:
            self.send404()

    def do_PUT(self):
        self.load_session()
        if self.path.startswith("/favBoyNames/"):
            self.handleUpdateName()

        elif self.path.startswith("/favGirlNames/"):
            self.handleUpdateName()

        else:
            self.send404()

    def do_POST(self):
        self.load_session()

        if self.path == "/favBoyNames":
            self.handleCreateName()

        elif self.path == "/favGirlNames":
            self.handleCreateName()

        elif self.path == "/users":
            self.handleCreateUser()

        elif self.path == "/sessions":
            self.handleCreateSession()

        else:
            self.send404()

    def do_DELETE(self):
        self.load_session()
        if self.path.startswith("/favGirlNames/") or self.path.startswith("/favBoyNames/"):
            self.handleDeleteMember()

        else:
            self.send404()

    def handleDeleteMember(self):
        # Add this to all the methods I don't want to be allowed
        if "userID" not in self.session:
            self.handle401()
            return

        parts = self.path.split("/")
        nameID = parts[-1]
        db = NamesDB()
        name = db.getOneName(nameID)
        if name != None:
            db.deleteOneName(nameID)
            self.send_response(200)
            self.end_headers()
        else:
            self.send404()

    def handleCheckSession(self):
        if "userID" not in self.session:
            self.handle401()
            return

        db = NamesDB()
        user = db.getOneUserByID(self.session["userID"])
        if user != None:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(bytes(json.dumps(user["first_name"]), "utf-8"))

    def handleCreateSession(self):
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        parsed_body = parse_qs(body)        #decodes encoded data
        username = parsed_body["username"][0]
        password = parsed_body["password"][0]
        db = NamesDB()
        userFound = db.getOneUser(username)
        if userFound != None:
            verified = bcrypt.verify(password, userFound["encrypted_password"])
            if verified:
                self.session["userID"] = userFound["id"]
                self.send_response(201)
                self.end_headers()
                self.wfile.write(bytes(json.dumps(userFound["first_name"]), "utf-8"))
            else:
                self.handle401()
        else:
            self.handle401()

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
        user = db.getOneUser(email)
        if user == None:
            db.insertUser(fname, lname, email, encryptedPassword)
            self.send_response(201)
            self.end_headers()
        else:
            self.send_response(422)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(bytes("Email address already exists", "utf-8"))

    def handleCreateName(self):
        if "userID" not in self.session:
            self.handle401()
            return

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
        self.end_headers()

    def handleUpdateName(self):
        if "userID" not in self.session:
            self.handle401()
            return

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
            self.end_headers()
        else:
            self.send404()

    def handleNamesRetrieveCollection(self, gender, fav):
        if "userID" not in self.session:
            self.handle401()
            return

        # send_response(status code, )
        self.send_response(200)
        # send the header data send_header(key, value)
        self.send_header("Content-Type", "application/json")
        # have to call end_headers to finish the response
        self.end_headers()
        # send body
        db = NamesDB()
        names = db.getNames(gender, fav)
        self.wfile.write(bytes(json.dumps(names), "utf-8"))

    def handleNamesRetrieveMember(self):
        if "userID" not in self.session:
            self.handle401()
            return

        #print(self.path)
        parts = self.path.split("/")
        nameID = parts[-1]
        db = NamesDB()
        name = db.getOneName(nameID)
        if name != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
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

    def handle401(self):
        self.send_response(401)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(bytes("Invalid username or password", "utf-8"))


def run():
    try:
        #listen(local IP, port)
        listen = ('127.0.0.1', 8080)
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
