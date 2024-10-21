import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement } from 'chart.js';
import axios from '../../../axiosConfig';
import './Dashboard.css';

// Register the necessary components
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement);

// Helper function for chart data formatting
const formatChartData = (labels, data, backgroundColors) => {
    return {
        labels: labels,
        datasets: [{
            label: 'Count',
            data: data,
            backgroundColor: backgroundColors,
        }]
    };
};

const Dashboard = () => {
    const [groupRiskData, setGroupRiskData] = useState({});
    const [tenureRiskData, setTenureRiskData] = useState({});
    const [contractRiskData, setContractRiskData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch group-wise risk distribution
                const groupResponse = await axios.get('/api/groupwise-risk');
                const groupLabels = groupResponse.data.map(row => row.groupType);
                const groupValues = groupResponse.data.map(row => row.count);
                const groupColors = [
                    'rgba(75, 192, 192, 0.6)',  // Color for Group 1
                    'rgba(153, 102, 255, 0.6)', // Color for Group 2
                    'rgba(255, 99, 132, 0.6)',  // Color for Group 3
                    'rgba(255, 206, 86, 0.6)',  // Color for Group 4
                ];

                // Fetch tenure-wise risk distribution
                const tenureResponse = await axios.get('/api/tenurewise-risk');
                const tenureData = tenureResponse.data;

                // Group tenures into ranges
                const tenureGroups = [];
                for (let i = 0; i <= 80; i += 10) {
                    tenureGroups.push(`${i}-${i + 10}`);
                }

                // Initialize counts for each tenure group and risk level
                const tenureCounts = {
                    Low: new Array(tenureGroups.length).fill(0),
                    Medium: new Array(tenureGroups.length).fill(0),
                    High: new Array(tenureGroups.length).fill(0),
                };

                // Count occurrences in tenure groups for each risk level
                tenureData.forEach(row => {
                    const tenure = parseInt(row.tenure, 10);
                    const groupIndex = Math.floor(tenure / 10);
                    const riskGroup = row.riskGroup; // Assuming riskGroup field exists in row
                    if (groupIndex < tenureCounts.Low.length) {
                        tenureCounts[riskGroup][groupIndex] += row.count; // Assuming count is provided for each tenure
                    }
                });

                // Convert tenureCounts to dataset format
                const tenureDatasets = Object.keys(tenureCounts).map(riskGroup => ({
                    label: riskGroup,
                    data: tenureCounts[riskGroup],
                    backgroundColor: getColorForGroup(riskGroup), // Function to get color for each risk group
                }));

                // Fetch contract-wise risk distribution
                const contractResponse = await axios.get('/api/contractwise-risk');
                const contractData = contractResponse.data;
                const contractLabels = [...new Set(contractData.map(row => row.Contract))];

                // Initialize counts for each contract and risk level
                const contractCounts = {
                    Low: new Array(contractLabels.length).fill(0),
                    Medium: new Array(contractLabels.length).fill(0),
                    High: new Array(contractLabels.length).fill(0),
                };

                // Count occurrences for each contract and risk group
                contractData.forEach(row => {
                    const index = contractLabels.indexOf(row.Contract);
                    const riskGroup = row.riskGroup; // Assuming riskGroup field exists in row
                    if (index !== -1) {
                        contractCounts[riskGroup][index] += row.count; // Assuming count is provided for each contract
                    }
                });

                // Convert contractCounts to dataset format
                const contractDatasets = Object.keys(contractCounts).map(riskGroup => ({
                    label: riskGroup,
                    data: contractCounts[riskGroup],
                    backgroundColor: getColorForGroup(riskGroup),
                }));

                // Update state
                setGroupRiskData(formatChartData(groupLabels, groupValues, groupColors));
                setTenureRiskData({
                    labels: tenureGroups,
                    datasets: tenureDatasets,
                });
                setContractRiskData({
                    labels: contractLabels,
                    datasets: contractDatasets,
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to assign colors based on risk group
    const getColorForGroup = (group) => {
        switch (group) {
            case 'Low':
                return 'rgba(75, 192, 192, 0.6)';
            case 'Medium':
                return 'rgba(255, 206, 86, 0.6)';
            case 'High':
                return 'rgba(255, 99, 132, 0.6)';
            default:
                return 'rgba(54, 162, 235, 0.6)';
        }
    };

    return (
        <div className="dashboard">
            {/* <h1>Risk Distribution Dashboard</h1> */}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="charts-container">
                    <div className="chart">
                        <h2>Group-wise Risk Distribution</h2>
                        <Pie data={groupRiskData} />
                    </div>
                    <div className="chart">
                        <h2>Tenure-wise Risk Distribution</h2>
                        <Bar data={tenureRiskData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Risk Distribution by Tenure',
                                },
                            },
                        }} />
                    </div>
                    <div className="chart">
                        <h2>Contract-wise Risk Distribution</h2>
                        <Bar data={contractRiskData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Risk Distribution by Contract',
                                },
                            },
                        }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
