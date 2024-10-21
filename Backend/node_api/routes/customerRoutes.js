const express = require('express');
const router = express.Router();
const db = require('../dbConnection');

// Fetch customers with pagination
router.get('/customers', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 10; // Records per page, default is 10

    const offset = (page - 1) * limit;

    try {
        // Now using the promise-based API
        const [customers] = await db.query('SELECT * FROM customers LIMIT ? OFFSET ?', [limit, offset]);
        const [[total]] = await db.query('SELECT COUNT(*) as count FROM customers');

        res.json({
            customers,
            total: total.count,
            page,
            totalPages: Math.ceil(total.count / limit),
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

module.exports = router;