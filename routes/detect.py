from flask import Blueprint, jsonify
from services.db_service import logs_collection, alerts_collection
from services.ml_service import predict_log
from mitigation.rules import mitigate

detect_bp = Blueprint("detect", __name__)

@detect_bp.route("/detect", methods=["POST"])
def detect():
    logs = list(logs_collection.find())

    alerts = []

    for log in logs:
        features = [
            log["bytes_sent"],
            log["bytes_received"]
        ]

        label, score = predict_log(features)
        action = mitigate(label, log["source_ip"])

        alert = {
            "log_id": str(log["_id"]),
            "threat_label": label,
            "threat_score": score,
            "action_taken": action
        }

        alerts_collection.insert_one(alert)
        alerts.append(alert)

    return jsonify(alerts)
