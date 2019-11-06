import os, base64

class SessionStore:

    def __init__(self):
        self.sessions = {}          # filing cabinet (dictionary of dictionaries)

    def createSession(self):
        newSessionID = self.generateSessionId()
        self.sessions[newSessionID] = {}        # starts empty file folder

    def getSession(self, sessionID):
        if sessionID in self.sessions:
            return self.sessions[sessionID]
        else:
            return none

    def generateSessionId(self):
        rnum = os.urandom(32)                   # more random number generator
        rstr = base64.b64encode(rnum).decode("utf-8")  # convert to b64 to shorten string
        return rstr
        
