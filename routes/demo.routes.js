const express = require('express');
const router = express.Router();
const { auth, authorize, ROLES } = require('../middleware/auth.middleware');

// Demo login endpoint
router.post('/auth/demo-login', (req, res) => {
  const { mobile, password } = req.body;
  
  if (!mobile || !password) {
    return res.status(400).json({ error: 'Mobile and password are required' });
  }

  // Check demo credentials
  if (mobile === '9876543210' && password === 'demo123') {
    res.json({
      success: true,
      user: {
        mobile: '9876543210',
        name: 'Demo Farmer',
        role: ROLES.FARMER
      }
    });
  } else if (mobile === '9876543211' && password === 'expert123') {
    res.json({
      success: true,
      user: {
        mobile: '9876543211',
        name: 'Demo Expert',
        role: ROLES.EXPERT
      }
    });
  } else if (mobile === '9876543212' && password === 'admin123') {
    res.json({
      success: true,
      user: {
        mobile: '9876543212',
        name: 'Demo Admin',
        role: ROLES.ADMIN
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid demo credentials' });
  }
});

// Demo dashboard data
router.get('/dashboard/demo-data', auth, (req, res) => {
  const demoData = {
    totalFarms: 150,
    activeFarms: 120,
    pendingSoilTests: 25,
    completedSoilTests: 175,
    cropSuggestions: [
      {
        crop: 'Tomato',
        area: '10 acres',
        status: 'Recommended'
      },
      {
        crop: 'Papaya',
        area: '5 acres',
        status: 'Recommended'
      }
    ],
    weather: {
      temperature: '28°C',
      humidity: '65%',
      forecast: 'Sunny'
    }
  };

  res.json({
    success: true,
    data: demoData
  });
});

// Demo soil tests
router.get('/soil-tests/demo', auth, (req, res) => {
  const demoSoilTests = [
    {
      id: 1,
      farmName: 'Demo Farm 1',
      location: 'Maharashtra, India',
      pH: 6.5,
      nitrogen: 80,
      phosphorus: 50,
      potassium: 65,
      status: 'Completed',
      recommendations: [
        'Add nitrogen fertilizer',
        'Maintain current potassium levels'
      ]
    },
    {
      id: 2,
      farmName: 'Demo Farm 2',
      location: 'Maharashtra, India',
      pH: 7.2,
      nitrogen: 70,
      phosphorus: 45,
      potassium: 70,
      status: 'Pending',
      recommendations: []
    }
  ];

  res.json({
    success: true,
    data: demoSoilTests
  });
});

module.exports = router;
