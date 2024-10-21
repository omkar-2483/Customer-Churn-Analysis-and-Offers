import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig"; // Your axios instance
import "../../adminPage/customerTable/CustomerTable.css";

const OffersTable = ({ offersUpdated }) => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  const fetchOffers = async (page) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`/api/offers?page=${page}&limit=10`); // Fetch offers with pagination
      setOffers(response.data.offers);
      setTotalPages(response.data.totalPages);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to fetch offers.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const deleteOffer = async (offerID) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(`/api/offers/${offerID}`);
        alert('Offer deleted successfully!'); // Confirmation message
        fetchOffers(page); // Refresh the offers list after deletion
      } catch (error) {
        console.error("Error deleting offer:", error);
        alert('Failed to delete offer.');
      }
    }
  };

  useEffect(() => {
    fetchOffers(page); // Fetch offers whenever the page changes
  }, [page, offersUpdated]);

  return (
    <div>
      {loading && <div>Loading offers...</div>} {/* Loading message */}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Offer ID</th>
            <th>Offer Name</th>
            <th>Risk Group</th>
            <th>Description</th>
            <th>Offer Details</th>
            <th>Validity</th>
            <th>Customers Benefited</th> {/* New column for customer count */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.offerID}>
              <td>{offer.offerID}</td>
              <td>{offer.offerName}</td>
              <td>{offer.riskGroup}</td>
              <td>{offer.description}</td>
              <td>{offer.offerDetails}</td>
              <td>{offer.validUntil}</td>
              <td>{offer.customerCount}</td> {/* Display customer count */}
              <td>
                <button onClick={() => deleteOffer(offer.offerID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OffersTable;
