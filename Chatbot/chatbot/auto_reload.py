import subprocess
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

APP_SCRIPT = "app.py"
SERVER_SCRIPT = "server.py"

# Store running processes
app_process = None
server_process = None

def start_app():
    """Start the app.py process."""
    global app_process
    if app_process:
        app_process.terminate()
        app_process.wait()
    
    print("Starting app.py...")
    app_process = subprocess.Popen(["python", APP_SCRIPT])

def start_server():
    """Start the server.py process (only once)."""
    global server_process
    if not server_process:  # Run server only once
        print("Starting server.py...")
        server_process = subprocess.Popen(["python", SERVER_SCRIPT])

class RestartHandler(FileSystemEventHandler):
    """Restart app.py when changes are detected."""
    def on_modified(self, event):
        if event.src_path.endswith(APP_SCRIPT):
            print("Detected change in app.py. Restarting...")
            start_app()

def watch_for_changes():
    """Monitor app.py for changes."""
    observer = Observer()
    event_handler = RestartHandler()
    observer.schedule(event_handler, path=".", recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_server()  # Start the Flask server first
    start_app()     # Start app.py
    watch_for_changes()  # Monitor changes in app.py
