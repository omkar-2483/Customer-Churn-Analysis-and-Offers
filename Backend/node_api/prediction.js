// customerRisk.js
require('dotenv').config();
const mysql = require('mysql2');
const axios = require('axios');

const db = require('./dbConnection');

// Function to fetch raw customer data from the database
async function fetchCustomerData() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM customers'; // Adjust query as needed
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

// Function to send customer data to the ML API for prediction
async function sendToMLApi(customers) {
    try {
        const response = await axios.post(process.env.API_URL, customers);
        return response.data;
    } catch (error) {
        console.error('Error sending data to ML API:', error);
        throw error;
    }
}

async function updateCustomerRiskGroups(predictionResult) {
    try {
        const { high_risk_customers, medium_risk_customers, low_risk_customers } = predictionResult;

        // Prepare an array of promises to update customer risk groups
        const updatePromises = [];

        high_risk_customers.forEach(customerID => {
            updatePromises.push(
                updateCustomerRiskGroup(customerID, 'high')
            );
        });

        medium_risk_customers.forEach(customerID => {
            updatePromises.push(
                updateCustomerRiskGroup(customerID, 'medium')
            );
        });

        low_risk_customers.forEach(customerID => {
            updatePromises.push(
                updateCustomerRiskGroup(customerID, 'low')
            );
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
        console.log('All customer risk groups updated successfully.');

    } catch (error) {
        console.error('Error updating customer risk groups:', error);
    }
}

// Helper function to update individual customer risk group
async function updateCustomerRiskGroup(customerID, riskGroup) {
    const query = 'UPDATE customers SET riskGroup = ? WHERE customerID = ?';
    const values = [riskGroup, customerID];

    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

// Main function to run the prediction process
async function runPredictionProcess() {
    try {
        const customers = await fetchCustomerData();

        if (customers.length > 0) {
            const formattedCustomers = customers.map(customer => ({
                customerID: customer.customerID,
                gender: customer.gender,
                SeniorCitizen: customer.SeniorCitizen,
                Partner: customer.Partner,
                Dependents: customer.Dependents,
                tenure: customer.tenure,
                PhoneService: customer.PhoneService,
                MultipleLines: customer.MultipleLines,
                InternetService: customer.InternetService,
                OnlineSecurity: customer.OnlineSecurity,
                OnlineBackup: customer.OnlineBackup,
                DeviceProtection: customer.DeviceProtection,
                TechSupport: customer.TechSupport,
                StreamingTV: customer.StreamingTV,
                StreamingMovies: customer.StreamingMovies,
                Contract: customer.Contract,
                PaperlessBilling: customer.PaperlessBilling,
                PaymentMethod: customer.PaymentMethod,
                MonthlyCharges: customer.MonthlyCharges,
                TotalCharges: customer.TotalCharges,
            }));

            const predictionResult = await sendToMLApi(formattedCustomers);
            console.log('Prediction Result:', predictionResult);
            await updateCustomerRiskGroups(predictionResult);
        } else {
            console.log('No new customers to process.');
        }
    } catch (error) {
        console.error('Error in the prediction process:', error);
    }
}

// Set an interval to run the prediction process
const startPredictionProcess = () => {
    setInterval(runPredictionProcess, parseInt(process.env.INTERVAL));
};

// Export the function to start the prediction process
module.exports = { startPredictionProcess };
