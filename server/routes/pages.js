const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');

// קבלת כל העמודים
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find()
      .populate('author', 'username firstName lastName')
      .populate('parent', 'title')
      .sort({ order: 1, createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// קבלת עמוד ספציפי
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug })
      .populate('author', 'username firstName lastName')
      .populate('parent', 'title');
    if (!page) {
      return res.status(404).json({ message: 'עמוד לא נמצא' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// יצירת עמוד חדש
router.post('/', auth, async (req, res) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
    parent: req.body.parent,
    order: req.body.order,
    template: req.body.template,
    isHome: req.body.isHome,
    metaDescription: req.body.metaDescription,
    metaKeywords: req.body.metaKeywords,
    author: req.user._id
  });

  try {
    const newPage = await page.save();
    res.status(201).json(newPage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// עדכון עמוד
router.put('/:id', auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'עמוד לא נמצא' });
    }

    // בדיקת הרשאות
    if (page.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'אין הרשאה לערוך עמוד זה' });
    }

    Object.assign(page, req.body);
    const updatedPage = await page.save();
    res.json(updatedPage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// מחיקת עמוד
router.delete('/:id', auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'עמוד לא נמצא' });
    }

    // בדיקת הרשאות
    if (page.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'אין הרשאה למחוק עמוד זה' });
    }

    // בדיקה אם יש עמודים תלויים
    const hasChildren = await Page.exists({ parent: page._id });
    if (hasChildren) {
      return res.status(400).json({ message: 'לא ניתן למחוק עמוד שיש לו עמודים תלויים' });
    }

    await page.deleteOne();
    res.json({ message: 'העמוד נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 