import mongoose, { Document, Model } from 'mongoose';

interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  service: {
    type: String
  }
}, {
  timestamps: true
});

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact; 