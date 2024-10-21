CREATE DATABASE customer_churn_analysis;
USE customer_churn_analysis

CREATE TABLE customer ( customerID VARCHAR(50) PRIMARY KEY, gender VARCHAR(10), SeniorCitizen BOOLEAN, Partner VARCHAR(10), Dependents VARCHAR(10), tenure INT, PhoneService VARCHAR(10), MultipleLines VARCHAR(20), InternetService VARCHAR(20), OnlineSecurity VARCHAR(20), OnlineBackup VARCHAR(20), DeviceProtection VARCHAR(20), TechSupport VARCHAR(20), StreamingTV VARCHAR(20), StreamingMovies VARCHAR(20), Contract VARCHAR(20), PaperlessBilling BOOLEAN, PaymentMethod VARCHAR(50), MonthlyCharges DECIMAL(10, 2), TotalCharges DECIMAL(10, 2) );

-- LOAD DATA INFILE "C:/Users/Shubham/Projects/Customer Churn Analysis/Backend/ml_api/Telco-Customer-Churn.csv" INTO TABLE customer FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' (customerID,gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,InternetService,OnlineSecurity,OnlineBackup,DeviceProtection,TechSupport,StreamingTV,StreamingMovies,Contract,PaperlessBilling,PaymentMethod,MonthlyCharges,TotalCharges);
ALTER TABLE Customers
ADD COLUMN riskGroup ENUM('Low', 'Medium', 'High-Seniors','High-Adults') AFTER TotalCharges;

CREATE TABLE Offers (
    offerID INT PRIMARY KEY AUTO_INCREMENT,
    offerName VARCHAR(255),
    description TEXT,
    riskGroup ENUM('Low', 'Medium', 'High'), -- The risk group this offer applies to
    offerDetails TEXT, -- Store discount details or other specific data
    validUntil DATE, -- Expiration date for the offer
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE CustomerOffers (
    customerID VARCHAR(50),
    offerID INT,
    offerDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customerID, offerID), -- Composite primary key
    FOREIGN KEY (customerID) REFERENCES customers(customerID),
    FOREIGN KEY (offerID) REFERENCES offers(offerID)
);

ALTER TABLE customeroffers 
DROP FOREIGN KEY customeroffers_ibfk_1, 
DROP FOREIGN KEY customeroffers_ibfk_2;

ALTER TABLE customeroffers
ADD CONSTRAINT fk_customer
FOREIGN KEY (customerID) REFERENCES customers(customerID)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE customeroffers
ADD CONSTRAINT fk_offer
FOREIGN KEY (offerID) REFERENCES offers(offerID)
ON DELETE CASCADE ON UPDATE CASCADE;