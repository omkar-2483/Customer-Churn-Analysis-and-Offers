# Import necessary libraries
import pickle
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI()

# Define the input model based on raw customer data
class CustomerInput(BaseModel):
    customerID: str
    gender: str
    SeniorCitizen: bool
    Partner: str
    Dependents: str
    tenure: int
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: bool
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float

# Load the model
churn_model = pickle.load(open('customer_churn.sav', 'rb'))

# Preprocess the data
def preprocess(customer: CustomerInput):
    # Convert raw input into model-compatible features (one-hot encoding, etc.)
    
    gender_Female = 1 if customer.gender == 'Female' else 0
    gender_Male = 1 if customer.gender == 'Male' else 0
    Partner_No = 1 if customer.Partner == 'No' else 0
    Partner_Yes = 1 if customer.Partner == 'Yes' else 0
    Dependents_No = 1 if customer.Dependents == 'No' else 0
    Dependents_Yes = 1 if customer.Dependents == 'Yes' else 0
    PhoneService_No = 1 if customer.PhoneService == 'No' else 0
    PhoneService_Yes = 1 if customer.PhoneService == 'Yes' else 0
    MultipleLines_No = 1 if customer.MultipleLines == 'No' else 0
    MultipleLines_Yes = 1 if customer.MultipleLines == 'Yes' else 0
    MultipleLines_No_phone_service = 1 if customer.MultipleLines == 'No phone service' else 0
    InternetService_DSL = 1 if customer.InternetService == 'DSL' else 0
    InternetService_Fiber_optic = 1 if customer.InternetService == 'Fiber optic' else 0
    InternetService_No = 1 if customer.InternetService == 'No' else 0
    OnlineSecurity_No = 1 if customer.OnlineSecurity == 'No' else 0
    OnlineSecurity_Yes = 1 if customer.OnlineSecurity == 'Yes' else 0
    OnlineSecurity_No_internet_service = 1 if customer.OnlineSecurity == 'No internet service' else 0
    OnlineBackup_No = 1 if customer.OnlineBackup == 'No' else 0
    OnlineBackup_Yes = 1 if customer.OnlineBackup == 'Yes' else 0
    OnlineBackup_No_internet_service = 1 if customer.OnlineBackup == 'No internet service' else 0
    DeviceProtection_No = 1 if customer.DeviceProtection == 'No' else 0
    DeviceProtection_Yes = 1 if customer.DeviceProtection == 'Yes' else 0
    DeviceProtection_No_internet_service = 1 if customer.DeviceProtection=='No internet service' else 0
    TechSupport_No = 1 if customer.TechSupport == 'No' else 0
    TechSupport_Yes = 1 if customer.TechSupport == 'Yes' else 0
    TechSupport_No_internet_service = 1 if customer.TechSupport == 'No internet service' else 0
    StreamingTV_No = 1 if customer.StreamingTV == 'No' else 0
    StreamingTV_Yes = 1 if customer.StreamingTV == 'Yes' else 0
    StreamingTV_No_internet_service = 1 if customer.StreamingTV == 'No internet service' else 0
    StreamingMovies_No = 1 if customer.StreamingMovies == 'No' else 0
    StreamingMovies_Yes = 1 if customer.StreamingMovies == 'Yes' else 0
    StreamingMovies_No_internet_service = 1 if customer.StreamingMovies == 'No internet service' else 0
    Contract_Month_to_month = 1 if customer.Contract == 'Month-to-month' else 0
    Contract_One_year = 1 if customer.Contract == 'One year' else 0
    Contract_Two_year = 1 if customer.Contract == 'Two year' else 0
    PaperlessBilling_No = 1 if not customer.PaperlessBilling else 0
    PaperlessBilling_Yes = 1 if customer.PaperlessBilling else 0
    PaymentMethod_Bank_transfer_automatic = 1 if customer.PaymentMethod == 'Bank transfer (automatic)' else 0
    PaymentMethod_Credit_card_automatic = 1 if customer.PaymentMethod == 'Credit card (automatic)' else 0
    PaymentMethod_Electronic_check = 1 if customer.PaymentMethod == 'Electronic check' else 0
    PaymentMethod_Mailed_check = 1 if customer.PaymentMethod == 'Mailed check' else 0
    
    # The tenure groups can be custom encoded like this:
    tenure = customer.tenure
    TenureGroup_1_12 = 1 if tenure <= 12 else 0
    TenureGroup_13_24 = 1 if 13 <= tenure <= 24 else 0
    TenureGroup_25_36 = 1 if 25 <= tenure <= 36 else 0
    TenureGroup_37_48 = 1 if 37 <= tenure <= 48 else 0
    TenureGroup_49_60 = 1 if 49 <= tenure <= 60 else 0
    TenureGroup_61_72 = 1 if 61 <= tenure <= 72 else 0

    # Return a list that matches the input format of the model
    return [
        customer.SeniorCitizen,
        customer.MonthlyCharges,
        customer.TotalCharges,
        gender_Female, gender_Male,
        Partner_No, Partner_Yes,
        Dependents_No, Dependents_Yes,
        PhoneService_No, PhoneService_Yes,
        MultipleLines_No, MultipleLines_Yes, MultipleLines_No_phone_service,
        InternetService_DSL, InternetService_Fiber_optic, InternetService_No,
        OnlineSecurity_No,OnlineSecurity_No_internet_service, OnlineSecurity_Yes,
        OnlineBackup_No,OnlineBackup_No_internet_service, OnlineBackup_Yes,
        DeviceProtection_No,DeviceProtection_No_internet_service, DeviceProtection_Yes,
        TechSupport_No,TechSupport_No_internet_service, TechSupport_Yes,
        StreamingTV_No, StreamingTV_No_internet_service, StreamingTV_Yes,
        StreamingMovies_No,StreamingMovies_No_internet_service, StreamingMovies_Yes,
        Contract_Month_to_month, Contract_One_year, Contract_Two_year,
        PaperlessBilling_No, PaperlessBilling_Yes,
        PaymentMethod_Bank_transfer_automatic, PaymentMethod_Credit_card_automatic,
        PaymentMethod_Electronic_check, PaymentMethod_Mailed_check,
        TenureGroup_1_12, TenureGroup_13_24, TenureGroup_25_36,
        TenureGroup_37_48, TenureGroup_49_60, TenureGroup_61_72
    ]

# Create API route for multiple rows
@app.post('/churn_prediction')
def churn_predict(input_parameters: List[CustomerInput]):
    input_data_list = []
    customer_ids = []

    # Preprocess each customer input and store their customerID
    for input_item in input_parameters:
        input_data_list.append(preprocess(input_item))
        customer_ids.append(input_item.customerID)

    # Make predictions for all input rows
    predictions = churn_model.predict_proba(input_data_list)
    churn_probabilities = [pred[1] for pred in predictions]

    # Group customers based on churn probability
    high_risk = []
    medium_risk = []
    low_risk = []

    for i, prediction in enumerate(churn_probabilities):
        if prediction >= 0.70:
            high_risk.append(customer_ids[i])
        elif 0.40 <= prediction < 0.70:
            medium_risk.append(customer_ids[i])
        else:
            low_risk.append(customer_ids[i])

    return {
        'high_risk_customers': high_risk,
        'medium_risk_customers': medium_risk,
        'low_risk_customers': low_risk
    }



#to start ml server: uvicorn ml_api:app --reload 

