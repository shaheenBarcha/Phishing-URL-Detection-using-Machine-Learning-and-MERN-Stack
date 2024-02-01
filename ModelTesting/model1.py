import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from joblib import dump

# Load the dataset
df = pd.read_csv("ds.csv")

# Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(df["URLs"], df["Labels"], test_size=0.25)

# Create a logistic regression model
model = LogisticRegression()

# Train the model
model.fit(X_train, y_train)

# Predict the labels for the test set
y_pred = model.predict(X_test)

# Calculate the accuracy of the predictions
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)

# Save the model
dump(model, "model.joblib")

# Predict a phishing URL
def predict_url(url):
    prediction = model.predict([url])
    if prediction == 1:
        print("The URL is phishing.")
    else:
        print("The URL is legitimate.")

url = input("Enter a URL: ")

predict_url(url)
