import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { router as usersRouter } from './src/routes/users.js';
import { router as eventsRouter } from './src/routes/events.js';

const app = express();
const uri = process.env.DB_URI;

mongoose
  .set('strictQuery', false)
  .connect(uri, { user: process.env.DB_USER, pass: process.env.DB_PASS })
  .then(() => {
    console.log('MongoDB connected...')
  });

app.use(cors());
app.use('/users', express.json(), usersRouter);
app.use('/events', express.json(), eventsRouter);

app.listen(process.env.PORT);
