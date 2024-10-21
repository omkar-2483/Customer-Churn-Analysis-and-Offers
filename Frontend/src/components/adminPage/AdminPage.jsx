import React from "react";
import CustomerTable from "./customerTable/CustomerTable";
import Dashboard from "./dashboard/Dashboard";

function AdminPage() {
  return (
    <div>
      <h1>Admin DashBoard</h1>
      <Dashboard />
      <CustomerTable />
    </div>
  );
}

export default AdminPage;
