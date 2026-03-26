import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a board name'],
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Board', boardSchema);
