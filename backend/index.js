require('dotenv').config();
const http=require('http');
const mongoose=require('mongoose');
const app=require('./src/app');

const MONGO_URL=process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(()=>{
    const server=http.createServer(app);
    server.listen(4000,()=>{
        console.log('Server is running on port 4000');
    })
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});