import React, { useState } from "react";
import "./AddOffers.css";
import axios from "../../../axiosConfig";

const AddOffer = ({ onFormSubmit }) => {
  const [offerName, setOfferName] = useState("");
  const [description, setDescription] = useState("");
  const [riskGroup, setRiskGroup] = useState("Low");
  const [offerDetails, setOfferDetails] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOffer = {
      offerName,
      description,
      riskGroup,
      offerDetails,
      validUntil,
    };

    try {
      const response = await axios.post("/api/offers", newOffer);

      if (response.status === 200) {
        alert("Offer added successfully!");

        // Reset form fields
        setOfferName("");
        setDescription("");
        setRiskGroup("Low");
        setOfferDetails("");
        setValidUntil("");
      } else {
        alert("Error adding offer.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding offer.");
    }
  };

  return (
    <div className="add-offer-container">
      <h2>Add a New Offer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="offerName">Offer Name:</label>
          <input
            type="text"
            id="offerName"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="riskGroup">Risk Group:</label>
          <select
            id="riskGroup"
            value={riskGroup}
            onChange={(e) => setRiskGroup(e.target.value)}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High-Seniors">High-Seniors</option>
            <option value="High-Adults">High-Adults</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="offerDetails">Offer Details:</label>
          <input
            type="text"
            id="offerDetails"
            value={offerDetails}
            onChange={(e) => setOfferDetails(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="validUntil">Valid Until:</label>
          <input
            type="date"
            id="validUntil"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Offer</button>
        <button onClick={onFormSubmit}>Close</button>
      </form>
    </div>
  );
};

export default AddOffer;
