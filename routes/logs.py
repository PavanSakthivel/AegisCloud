from flask import Blueprint, request, jsonify
from services.db_service import logs_collection

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/logs", methods=["POST"])
def add_log():
    log = request.json
    logs_collection.insert_one(log)
    return jsonify({"message": "Log stored"})
