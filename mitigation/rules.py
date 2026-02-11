def classify_threat(threat_score: float) -> str:
    if threat_score < 0.4:
        return "Normal"
    elif threat_score < 0.7:
        return "Suspicious"
    else:
        return "Attack"
