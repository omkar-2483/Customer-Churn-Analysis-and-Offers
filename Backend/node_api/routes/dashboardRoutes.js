const express = require('express');
const router = express.Router();
const db = require('../dbConnection');

// Fetch group-wise distribution of risk
router.get('/groupwise-risk', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                CASE WHEN seniorCitizen = 1 AND riskGroup = 'High' THEN 'Senior (High)'
                     WHEN seniorCitizen = 0 AND riskGroup = 'High' THEN 'Non-Senior (High)'
                     WHEN riskGroup = 'Medium' THEN 'Medium'
                     ELSE 'Low'
                END AS groupType,
                COUNT(*) AS count
            FROM customers
            GROUP BY groupType`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch tenure-wise risk distribution
router.get('/tenurewise-risk', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT tenure, riskGroup, COUNT(*) AS count
             FROM customers
             GROUP BY tenure, riskGroup`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch contract-wise risk distribution
router.get('/contractwise-risk', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT Contract, riskGroup, COUNT(*) AS count
             FROM customers
             GROUP BY Contract, riskGroup`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch monthly charges and total charges distribution
router.get('/chargeswise-distribution', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT MonthlyCharges, TotalCharges, riskGroup, COUNT(*) AS count
             FROM customers
             GROUP BY MonthlyCharges, TotalCharges, riskGroup`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
