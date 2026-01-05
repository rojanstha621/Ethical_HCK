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

const projectSchema = new mongoose.Schema({
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
    required: true,
    trim: true,
  },
  category: {
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
  github: {
    type: String,
    trim: true,
  },
  demo: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
  }],
  highlights: [{
    type: String,
  }],
  learning: [{
    type: String,
  }],
  tools: [{
    type: String,
  }],
  customSections: [customSectionSchema],
  featured: {
    type: Boolean,
    default: false,
  },
  showOnHomepage: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Project', projectSchema);
