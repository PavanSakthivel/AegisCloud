from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["cloudsentinel"]

logs_collection = db["cloud_logs"]
alerts_collection = db["alerts"]
