import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { router as usersRouter } from './src/routes/users.js';
import { router as eventsRouter } from './src/routes/events.js';

const app = express();
const uri = 'mongodb+srv://thinkmobiles.a9vqdj8.mongodb.net/test';

mongoose
  .set('strictQuery', false)
  .connect(uri, { user: 'dbadmin', pass: 'dbadmin777' })
  .then(() => {
    console.log('MongoDB connected...')
  });

app.use(cors());
app.use('/users', express.json(), usersRouter);
app.use('/events', express.json(), eventsRouter);


app.listen(5000);
