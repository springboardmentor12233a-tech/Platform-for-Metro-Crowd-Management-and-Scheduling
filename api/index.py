import sys
import os

# Set up Python paths so backend modules import cleanly
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, 'backend')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app

# Vercel serverless entry handler
# 'app' is the Flask application instance
