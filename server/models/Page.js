const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  metaKeywords: [{
    type: String,
    trim: true
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  template: {
    type: String,
    default: 'default'
  },
  isHome: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// יצירת slug אוטומטי מהכותרת
pageSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page; 