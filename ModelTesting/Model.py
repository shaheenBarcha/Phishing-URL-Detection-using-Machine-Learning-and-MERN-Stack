from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from tqdm import tqdm
import joblib
import pandas as pd

app = Flask(__name__)

def add_cors_headers(f):
    def wrapper(*args, **kwargs):
        response = f(*args, **kwargs)
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'GET'
        return response
    return wrapper

# Step 2: Load the dataset into a pandas DataFrame
# Assuming you have the dataset.csv file and it contains the required columns (URL, Label)
data = pd.read_csv('dataset.csv')

# Step 3: Split the dataset into features (URLs)
X = data['URL']

# Step 4: Convert the URLs into numerical feature vectors using TF-IDF
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(X)

# Specify the number of samples to keep
num_samples = 20000

# Randomly select a subset of the data
X_subset = X[:num_samples]

# Check if the trained model already exists
try:
    # Load the trained model from file
    model = joblib.load('trained_model.joblib')
    print("Trained model loaded from file.")
except FileNotFoundError:
    # Train a new Isolation Forest model on the data
    model = IsolationForest()

    # Use tqdm for progress bar and ETA
    with tqdm(total=num_samples, desc="Training", unit="sample") as pbar:
        for i in range(num_samples):
            X_sample = X_subset[i]
            model.fit(X_sample.reshape(-1, 1))
            pbar.update(1)

    # Save the trained model to file
    joblib.dump(model, 'trained_model.joblib')
    print("Trained model saved to file.")

def predict_url(url):
    url_vector = vectorizer.transform([url])
    prediction = model.predict(url_vector)
    return "good" if prediction[0] == 1 else "bad"

@app.route('/')
def home():
    return "Welcome to the Flask server!"

@app.route('/get_prediction')
@add_cors_headers
def get_prediction():
    url = request.args.get('url')
    if url:
        prediction = predict_url(url)
        result = "This is not a Phishing Site. You can access it" if prediction == 'good' else "This is Phishing Website."
        return jsonify(prediction=result)
    else:
        return jsonify(error="Please provide a URL parameter.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4100)
