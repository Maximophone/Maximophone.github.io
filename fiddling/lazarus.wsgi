import sys
sys.path.insert(0, "/var/www/html/lazarus")

from app import app as application
from server.game import Gx

gx = Gx()
gx.start()