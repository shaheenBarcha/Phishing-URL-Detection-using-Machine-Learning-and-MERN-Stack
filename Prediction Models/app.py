from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import warnings
import pickle
from feature import FeatureExtraction

warnings.filterwarnings('ignore')

file = open("pickle/model.pkl", "rb")
gbc = pickle.load(file)
file.close()

app = Flask(__name__)
CORS(app)

@app.route("/get_prediction", methods=["GET"])
def get_prediction():
    url = request.args.get("url")
    if not url:
        return jsonify(error="Please provide a URL parameter.")

    obj = FeatureExtraction(url)
    x = np.array(obj.getFeaturesList()).reshape(1, 30)

    y_pred = gbc.predict(x)[0]
    # 1 is safe, -1 is unsafe
    y_pro_phishing = gbc.predict_proba(x)[0, 0]
    y_pro_non_phishing = gbc.predict_proba(x)[0, 1]
    probability = round(y_pro_non_phishing, 2) if y_pred == 1 else round(y_pro_phishing, 2)
    prediction = "URL is safe to use with Accuracy of {}%".format(probability * 100) if y_pred == 1 else "Phishing URL with probability {}%".format(probability * 100)
    

    result = {
        "prediction": prediction
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=4100)
