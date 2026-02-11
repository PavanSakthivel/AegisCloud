from flask import Blueprint, jsonify
from services.db_service import alerts_collection

alerts_bp = Blueprint("alerts", __name__)

@alerts_bp.route("/alerts", methods=["GET"])
def get_alerts():
    alerts = list(alerts_collection.find({}, {"_id": 0}))
    return jsonify(alerts)
