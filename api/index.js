const express = require('express');
const connectDB = require('./db')
const bp = require('body-parser')
const sblog = require('./routes/blogRoute');
const comment = require('./routes/commentRoute');
const auth = require('./auth/auth')
const dashboard = require('./routes/dashboard')
const admin = require('./routes/adminRoute')
const dotenv = require('dotenv');
const app = express();
const cors = require('cors')

dotenv.config();
app.use(bp.json());
app.use(cors({
    origin: ['https://blog-app-front-blue.vercel.app/', 'http://localhost:5173', 'https://blogapp-front1.onrender.com'], // Add allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // If you need to send cookies
}));

const PORT = process.env.PORT;

//Routes
app.use('/api', sblog);
app.use('/api', dashboard);
app.use('/api', comment);
app.use('/api/auth', auth)
app.use('/api', admin)


//Connect to db
connectDB();

//Connect to port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})