from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
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

# Step 3: Split the dataset into features (URLs) and labels (phishing or non-phishing)
X = data['URL']
y = data['Label']

# Step 4: Convert the URLs into numerical feature vectors using TF-IDF
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(X)

# Step 5: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Specify the number of samples to keep
num_samples = 900

# Randomly select a subset of the training data
X_train_subset = X_train[:num_samples]
y_train_subset = y_train[:num_samples]

# Check if the trained model already exists
try:
    # Load the trained model from file
    classifier = joblib.load('trained_model.joblib')
    print("Trained model loaded from file.")
except FileNotFoundError:
    # Train a new Random Forest classifier on the training data
    classifier = RandomForestClassifier()

    # Use tqdm for progress bar and ETA
    with tqdm(total=num_samples, desc="Training", unit="sample") as pbar:
        for i in range(num_samples):
            X_sample = X_train_subset[i]
            y_sample = y_train_subset.iloc[i]  # Retrieve label using iloc
            classifier.fit(X_sample, [y_sample])
            pbar.update(1)

    # Save the trained model to file
    joblib.dump(classifier, 'trained_model.joblib')
    print("Trained model saved to file.")

# Step 7: Evaluate the model's performance on the testing data
accuracy = classifier.score(X_test, y_test)
print("Accuracy:", accuracy)

def predict_url(url):
    url_vector = vectorizer.transform([url])
    prediction = classifier.predict(url_vector)
    return prediction[0]

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
    
# Additional code for URL input from console
while True:
    user_input = input("Enter a URL (or 'quit' to exit): ")
    if user_input == 'quit':
        break
    prediction = predict_url(user_input)
    result = "This is not a Phishing Site. You can access it" if prediction == 'good' else "This is Phishing Website."
    print("Prediction:", result)
