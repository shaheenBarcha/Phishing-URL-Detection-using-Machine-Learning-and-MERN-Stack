import os
import pandas as pd
import pickle
import numpy as np
from flask import Flask, request, jsonify
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

app = Flask(__name__)

# Check if the trained model file exists
if os.path.exists('trained_gbc_model.pkl'):
    with open('trained_gbc_model.pkl', 'rb') as model_file:
        gbc = pickle.load(model_file)
else:
    # Load the dataset (replace 'dataset.csv' with your dataset)
    dataset = pd.read_csv('dataset.csv')

    # Assuming that your dataset has a target column named 'target' and features in other columns
    X = dataset.drop('target', axis=1)
    y = dataset['target']

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create and train the Gradient Boosting Classifier
    gbc = GradientBoostingClassifier(n_estimators=100, random_state=42)  # You can adjust hyperparameters as needed
    gbc.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = gbc.predict(X_test)

    # Calculate and print the accuracy on the test set
    accuracy = accuracy_score(y_test, y_pred)
    print(f'Accuracy on the test set: {accuracy:.2f}')

    # Save the trained model to a .pkl file
    with open('trained_gbc_model.pkl', 'wb') as model_file:
        pickle.dump(gbc, model_file)

    print("Trained model saved as 'trained_gbc_model.pkl'")

@app.route('/predict', methods=['POST'])
def predict_url():
    # Get the URL input from the request
    url = request.json.get('url', '')

    if not url:
        return jsonify({'error': 'Please provide a URL in the request.'})

    # Feature extraction (you will need to implement this part based on your dataset)
    # Here, we assume you have a function named 'extract_features' to extract features from the URL
    # Replace this with your actual feature extraction logic
    features = extract_features(url)

    # Make a prediction on the extracted features
    features = np.array(features).reshape(1, -1)
    prediction = gbc.predict(features)[0]

    # Define the response message based on the prediction
    if prediction == 1:
        result = {'prediction': 'Good URL'}
    else:
        result = {'prediction': 'Bad URL'}

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
