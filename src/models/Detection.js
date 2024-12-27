import mongoose from 'mongoose';

const DetectionSchema = new mongoose.Schema({
  frame_id: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  frame_file: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detections: [{
    label: String,
    confidence_score: Number,
    bounding_box: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    priority: String,
  }],
});

const Detection = mongoose.models.Detection || mongoose.model('Detection', DetectionSchema);

export default Detection; 