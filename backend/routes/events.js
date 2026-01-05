import express from 'express';
import Event from '../models/Event.js';
import { verifyAdminToken } from './auth.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { showOnHomepage } = req.query;
    let query = {};
    
    if (showOnHomepage === 'true') {
      query.showOnHomepage = true;
    }
    
    const events = await Event.find(query).sort({ date: -1 });
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found', success: false });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// Create event (protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// Update event (protected)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found', success: false });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// Delete event (protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found', success: false });
    }
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router;

