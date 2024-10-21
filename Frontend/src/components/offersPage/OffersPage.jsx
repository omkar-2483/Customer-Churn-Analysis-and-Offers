import React, { useState } from "react";
import OffersTable from "./offersTable/Offerstable"; // Check this import path
import AddOffers from "./addOffers/AddOffers"; // Check this import path

function OffersPage() {
  const [addOffers, setAddOffers] = useState(false);
  const [offersUpdated, setOffersUpdated] = useState(0); // Count state for refresh trigger

  const handleFormSubmit = () => {
    console.log("Form submitted!"); // Log to check if this function is called
    setAddOffers(false); // Hide AddOffers component
    setOffersUpdated((prev) => prev + 1); // Increment state to trigger table refresh
  };

  return (
    <div>
      {!addOffers && <button onClick={() => setAddOffers(true)}>Add Offer</button>}
      {addOffers && <AddOffers onFormSubmit={handleFormSubmit} />}
      
      <h1>Offers</h1>
      <OffersTable offersUpdated={offersUpdated} />
    </div>
  );
}

export default OffersPage;
