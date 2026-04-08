const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// POST /api/alerts — dispatch alert to emergency services
router.post('/', async (req, res) => {
  const { incidentId, services, location, message } = req.body;

  if (!incidentId || !services || !location) {
    return res.status(400).json({ error: 'incidentId, services, and location are required' });
  }

  try {
    // Check if incident exists
    const incident = await prisma.incident.findUnique({
      where: { id: parseInt(incidentId) }
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Persist the alert
    const alert = await prisma.alert.create({
      data: {
        incidentId: parseInt(incidentId),
        services: Array.isArray(services) ? services.join(', ') : services,
        location,
        message: message || 'Emergency incident reported. Immediate response required.',
        status: 'dispatched',
      },
    });

    console.log('Alert dispatched and persisted:', alert);
    res.status(201).json({ alert });
  } catch (error) {
    console.error('Error dispatching alert:', error);
    res.status(500).json({ error: 'Failed to dispatch alert' });
  }
});

// GET /api/alerts — get all alerts (added for completeness)
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { dispatchedAt: 'desc' },
      include: { incident: true }
    });
    res.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;
