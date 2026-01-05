import express from 'express';
import Member from '../models/Member.js';
import { verifyAdminToken } from './auth.js';

const router = express.Router();

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: 1 });
    res.json({ success: true, count: members.length, members });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// Get single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found', success: false });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// Create member (protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// Update member (protected)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!member) {
      return res.status(404).json({ error: 'Member not found', success: false });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// Delete member (protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found', success: false });
    }
    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router;
