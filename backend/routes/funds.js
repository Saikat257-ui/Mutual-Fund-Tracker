const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Save a mutual fund
router.post('/save', auth, async (req, res) => {
  try {
    const { fundId, schemeName, schemeCode } = req.body;
    const userId = req.userData.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if fund is already saved
    const fundExists = user.savedFunds.some(fund => fund.fundId === fundId);
    if (fundExists) {
      return res.status(400).json({ message: 'Fund already saved' });
    }

    user.savedFunds.push({
      fundId,
      schemeName,
      schemeCode
    });

    await user.save();
    res.status(201).json({
      message: 'Fund saved successfully',
      fund: user.savedFunds[user.savedFunds.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving fund',
      error: error.message
    });
  }
});

// Get all saved funds for a user
router.get('/saved', auth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.savedFunds);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching saved funds',
      error: error.message
    });
  }
});

// Remove a saved fund
router.delete('/saved/:fundId', auth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const fundId = req.params.fundId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedFunds = user.savedFunds.filter(fund => fund.fundId !== fundId);
    await user.save();

    res.json({ message: 'Fund removed successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error removing fund',
      error: error.message
    });
  }
});

module.exports = router;
