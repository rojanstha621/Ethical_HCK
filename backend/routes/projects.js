import express from 'express';
import Project from '../models/Project.js';
import { verifyAdminToken } from './auth.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { featured, showOnHomepage } = req.query;
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (showOnHomepage === 'true') {
      query.showOnHomepage = true;
    }
    
    const projects = await Project.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found', success: false });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

// Create project (protected)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// Update project (protected)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found', success: false });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});

// Delete project (protected)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found', success: false });
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router;

