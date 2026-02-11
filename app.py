from flask import Flask
from flask_cors import CORS

from routes.logs import logs_bp
from routes.detect import detect_bp
from routes.alerts import alerts_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(logs_bp)
app.register_blueprint(detect_bp)
app.register_blueprint(alerts_bp)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
