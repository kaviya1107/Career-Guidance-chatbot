# server.py (Flask API)
from flask import Flask, request, jsonify
from flask_cors import CORS
from app import generate_response, refresh_data
import threading

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat_handler():
    data = request.get_json()
    query = data.get('message', '').strip()
    
    if not query:
        return jsonify({"error": "Empty query"}), 400
    
    response = generate_response(query)
    return jsonify({"response": response})

@app.route('/refresh', methods=['POST'])
def manual_refresh():
    threading.Thread(target=refresh_data).start()
    return jsonify({"status": "Refresh initiated"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)