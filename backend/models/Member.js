import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
    default: '',
  },
  specialty: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  github: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Member', memberSchema);
