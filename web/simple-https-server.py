#!/usr/bin/python3

# taken from
# http://www.piware.de/2011/01/creating-an-https-server-in-python/ (Original version)
# https://gist.github.com/dergachev/7028596 ( Python 2 version)
# https://gist.github.com/DannyHinshaw/a3ac5991d66a2fe6d97a569c6cdac534 (Python 3 version)

# generate key.pem and server.pem with the following command:
#    openssl req -new -x509 -keyout key.pem -out server.pem -days 365 -nodes

# run as follows:
#    python simple-https-server.py

# Used port 4443 so it can run as normal user;
# the usual port 443 requires root privileges!

# then in your browser, visit:
#    https://localhost:4443


import http.server
import ssl

server_address = ('', 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               certfile="server.pem",
                               keyfile="key.pem",
                               ssl_version=ssl.PROTOCOL_TLSv1_2)
httpd.serve_forever()