#!/usr/bin/env python3
#built in http stuff
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import json


def fileToJSON(fileName):
    with open(fileName) as json_file:
        nameList = []
        data = json.load(json_file)
        for p in data:
            nameList.append(p)
    return nameList


# def JSONToFile()
#     with open(fileName) as json_file:
#         pass


class MyRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        print("The PATH is:", self.path )

        if self.path == "/girlNames":
            girls = fileToJSON('girls.json')
            # send_response(status code, )
            self.send_response(200)
            # send the header data send_header(key, value)
            self.send_header("Content-Type", "application/json")
            # have to call end_headers to finish the response
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            # send body
            self.wfile.write(bytes(json.dumps(girls), "utf-8"))

        elif self.path == "/boyNames":
            boys = fileToJSON('boys.json')
            # send_response(status code, )
            self.send_response(200)
            # send the header data send_header(key, value)
            self.send_header("Content-Type", "application/json")
            # have to call end_headers to finish the response
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            # send body
            self.wfile.write(bytes(json.dumps(boys), "utf-8"))

        else:
            #404
            self.send_response(404)
            self.end_headers()
            # TODO: Add body to send

    def do_POST(self):
        if self.path == "/boyNames":
            names = []
            length = self.headers["Content-Length"]

            # read the body (data)
            body = self.rfile.read(int(length)).decode("utf-8")
            parsed_body = parse_qs(body)        #decodes encoded data
            name = parsed_body["name"][0]
            names.append(name)
            print(parsed_body)

            # respond to the client
            self.send_response(201)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

        else:
            print(self.path)
            self.send_response(404)
            self.end_headers()


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
