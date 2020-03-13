from SimpleHTTPServer import SimpleHTTPRequestHandler
from BaseHTTPServer import HTTPServer

port = 8080

httpd = HTTPServer(('', port), SimpleHTTPRequestHandler)
print "serving at port ", port
httpd.serve_forever()
