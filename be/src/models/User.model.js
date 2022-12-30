import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  eventsCount: {
    type: Number,
    required: true
  },
  nextEventDate: {
    type: Date,
  }
}, { _id: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
