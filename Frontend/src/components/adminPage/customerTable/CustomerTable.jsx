import React, { useEffect, useState } from 'react';
import axios from '../../../axiosConfig'; // Your axios instance
import './CustomerTable.css';

const CustomerTable = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(0); // Total number of pages

    const fetchCustomers = async (page) => {
        try {
            const response = await axios.get(`/api/customers?page=${page}&limit=10`); // Fetch customers with pagination
            setCustomers(response.data.customers);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to fetch customers.');
        }
    };

    useEffect(() => {
        fetchCustomers(page); // Fetch customers whenever the page changes
    }, [page]);

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Gender</th>
                        <th>Senior Citizon</th>
                        <th>Tenure</th>
                        <th>Contract</th>
                        <th>Monthly Charge</th>
                        <th>Total Charge</th>
                        <th>Risk Group</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.customerID}>
                            <td>{customer.customerID}</td>
                            <td>{customer.gender}</td>
                            <td>{customer.SiniorCitizen===1? "Yes": "No"}</td>
                            <td>{customer.tenure}</td>
                            <td>{customer.Contract}</td>
                            <td>{customer.MonthlyCharges}</td>
                            <td>{customer.TotalCharges}</td>
                            <td>{customer.riskGroup}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default CustomerTable;

