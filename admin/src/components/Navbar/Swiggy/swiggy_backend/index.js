import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import restaurantRoutes from './routes/restaurant.routes.js';
const app = express();
dotenv.config();

console.log("Environment Variables Loaded");
mongoose.connect(process.env.DB_URL)
.then(()=>{console.log("DB CONNECTED SUCCESSFULLY")})
.catch((err)=>{console.log("DB CONNECTION FAILED", err)});

app.get('/', (req, res) => {
    res.send('Welcome to Swiggy Backend!');  
});   

restaurantRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});