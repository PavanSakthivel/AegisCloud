import joblib

model = joblib.load("ml/model.pkl")

def predict_log(features):
    score = model.decision_function([features])[0]

    if score < -0.2:
        label = "Attack"
    elif score < 0:
        label = "Suspicious"
    else:
        label = "Normal"

    return label, float(score)
