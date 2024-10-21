const express = require('express');
const { startPredictionProcess } = require('./prediction');
const app= express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const customerRoutes = require('./routes/customerRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const offersRoute = require('./routes/offersRoute.js')

// Start the prediction process
startPredictionProcess();

//routes
app.use('/api', customerRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', offersRoute);


app.listen(8800,()=>{
    console.log(`node_server running on: http://localhost:8800/`);
})

