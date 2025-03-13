require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const contactRoutes = require('./routes/contact');
const postRoutes = require('./routes/posts');
const pageRoutes = require('./routes/pages');
const userRoutes = require('./routes/users');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL.replace('myapp', 'blog-db'))
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors({
  origin: ['https://adi-phone.co.il', 'https://www.adi-phone.co.il', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the server!' });
});

// Temporary route to make first user admin
app.get('/make-admin', async (req, res) => {
  try {
    const User = mongoose.model('User');
    const user = await User.findOne({ email: 'admin@admin.com' });
    if (user) {
      user.role = 'admin';
      await user.save();
      res.json({ message: 'Admin user created successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 