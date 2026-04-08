const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET /api/incidents — list all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      include: { alerts: true }
    });
    res.json({ incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// POST /api/incidents — report a new incident
router.post('/', async (req, res) => {
  const { type, location, lat, lng, description, severity, reportedBy } = req.body;

  if (!type || !location) {
    return res.status(400).json({ error: 'Type and location are required' });
  }

  try {
    const incident = await prisma.incident.create({
      data: {
        type,
        location,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        description: description || '',
        severity: severity || 'moderate',
        reportedBy: reportedBy || 'anonymous',
        verified: false,
      },
    });
    res.status(201).json({ incident });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// PATCH /api/incidents/:id/verify — verify an incident
router.patch('/:id/verify', async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    const incident = await prisma.incident.update({
      where: { id },
      data: { verified: true },
    });
    res.json({ incident });
  } catch (error) {
    console.error('Error verifying incident:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.status(500).json({ error: 'Failed to verify incident' });
  }
});

module.exports = router;
