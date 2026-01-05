import express from 'express';
import Position from '../models/Position.js';
import { verifyAdminToken } from './auth.js';

const router = express.Router();

// Get all positions (public)
router.get('/', async (req, res) => {
    try {
        const positions = await Position.find().sort({ order: 1, name: 1 });
        res.json(positions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new position (admin only)
router.post('/', verifyAdminToken, async (req, res) => {
    try {
        const { name, order } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Position name is required' });
        }

        // Check if position already exists
        const existing = await Position.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ error: 'Position already exists' });
        }

        const position = new Position({
            name: name.trim(),
            order: order || 0,
        });

        await position.save();
        res.status(201).json(position);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a position (admin only)
router.put('/:id', verifyAdminToken, async (req, res) => {
    try {
        const { name, order } = req.body;
        const position = await Position.findByIdAndUpdate(
            req.params.id,
            { name: name?.trim(), order },
            { new: true }
        );

        if (!position) {
            return res.status(404).json({ error: 'Position not found' });
        }

        res.json(position);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a position (admin only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
    try {
        const position = await Position.findByIdAndDelete(req.params.id);

        if (!position) {
            return res.status(404).json({ error: 'Position not found' });
        }

        res.json({ message: 'Position deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
