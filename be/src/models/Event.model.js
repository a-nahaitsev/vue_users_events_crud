import mongoose from 'mongoose';

const { Schema } = mongoose;
const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
}, { _id: true });

const EventModel = mongoose.model('Event', eventSchema);

export default EventModel;
