const express = require('express');
const router = express.Router();
const db = require('../dbConnection');

// Fetch customers with pagination and customer count for each offer
router.get('/offers', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 10; // Records per page, default is 10

    const offset = (page - 1) * limit;

    try {
        // Now using the promise-based API
        const [offers] = await db.query(`
            SELECT o.*, COUNT(co.customerID) AS customerCount
            FROM offers o
            LEFT JOIN customeroffers co ON o.offerID = co.offerID
            GROUP BY o.offerID
            LIMIT ? OFFSET ?`, [limit, offset]);
        
        const [[total]] = await db.query('SELECT COUNT(*) as count FROM offers');

        res.json({
            offers,
            total: total.count,
            page,
            totalPages: Math.ceil(total.count / limit),
        });
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers.' });
    }
});


// Add offer and assign to customers based on risk group
router.post('/offers', async (req, res) => {
    const { offerName, description, riskGroup, offerDetails, validUntil } = req.body;

    // Define the insert offer query
    const insertOfferQuery = `INSERT INTO offers (offerName, description, riskGroup, offerDetails, validUntil) VALUES (?, ?, ?, ?, ?)`;

    try {
        // Insert the offer and get the offer ID
        const [result] = await db.query(insertOfferQuery, [offerName, description, riskGroup, offerDetails, validUntil]);
        const offerID = result.insertId; // Get the ID of the newly inserted offer

        // Fetch customers based on risk group
        let customerQuery;

        switch (riskGroup) {
            case 'Low':
                customerQuery = `SELECT customerID FROM customers WHERE riskGroup = 'Low'`;
                break;
            case 'Medium':
                customerQuery = `SELECT customerID FROM customers WHERE riskGroup = 'Medium'`;
                break;
            case 'High-Seniors':
                customerQuery = `SELECT customerID FROM customers WHERE riskGroup = 'High' AND SeniorCitizen = 1`;
                break;
            case 'High-Adults':
                customerQuery = `SELECT customerID FROM customers WHERE riskGroup = 'High' AND SeniorCitizen = 0`;
                break;
            default:
                return res.status(400).send('Invalid risk group');
        }

        console.log("Customer query: ", customerQuery);

        // Fetch matching customers
        const [customers] = await db.query(customerQuery);

        // Insert each customer offer
        const customerOffersQueries = customers.map(customer => {
            const assignOfferQuery = `INSERT INTO customeroffers (customerID, offerID, offerDate) VALUES (?, ?, NOW())`;
            return db.query(assignOfferQuery, [customer.customerID, offerID]);
        });

        // Execute all insert queries
        await Promise.all(customerOffersQueries);
        
        res.status(200).send('Offer added and assigned to customers successfully');
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).send('Error processing request'); // Send a generic error message
    }
});


//delete offer
router.delete('/offers/:id', async (req, res) => {
    const offerId = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM offers WHERE offerId = ?', [offerId]); // Assuming 'id' is the primary key

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;