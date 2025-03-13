import mongoose, { Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  date: string;
  keywords: string[];
  relatedPosts: string[];
  slug: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  keywords: [{
    type: String,
  }],
  relatedPosts: [{
    type: String,
  }],
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog; 