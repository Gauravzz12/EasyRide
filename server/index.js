const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
const cors=require('cors');
require('dotenv').config(); 

const app = express(); 
app.use(cors());
const port =  process.env.PORT;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.use('/', routes);
app.use('/location', routes);
app.use('/cabs', routes); 
app.use('/cabs/update/:id', routes);  
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 