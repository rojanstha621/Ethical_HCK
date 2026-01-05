import mongoose from 'mongoose';

const customSectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  fullDescription: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  gallery: [{
    type: String,
  }],
  videos: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  highlights: [{
    type: String,
  }],
  customSections: [customSectionSchema],
  showOnHomepage: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Event', eventSchema);
