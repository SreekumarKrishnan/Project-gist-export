import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/connectDB.js';

import userRoute from './routes/user.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/', userRoute);

const port = 3000;

app.listen(port, () => {
  connectDB();
  console.log(`server is running on port ${port}`);
});
