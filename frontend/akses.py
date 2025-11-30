from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__)

# Route untuk Frontend (HTML)
@app.route('/')
def home():
    return render_template('home.html')

# Route untuk API
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        'status': 'success',
        'data': 'Your data here'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    # Process your data here
    return jsonify({
        'status': 'success',
        'result': 'prediction result'
    })

if __name__ == '__main__':
    # 0.0.0.0 = accessible dari semua IP di jaringan
    # debug=True untuk development
    app.run(host='0.0.0.0', port=5500, debug=True)
