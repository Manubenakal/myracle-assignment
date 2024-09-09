from flask import Flask, request, jsonify
from flask_cors import CORS
from client import analyse_img

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Welcome to the Flask API!"

@app.route('/api/data', methods=['GET'])
def get_data():
    sample_data = {
        'name': 'Flask Example',
        'type': 'API',
        'status': 'running'
    }
    return jsonify(sample_data)

@app.route('/api/analyze', methods=['POST'])
def post_data():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    try:
        analysis = analyse_img(data)
        response = {
            'message': analysis
        }

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
