const express = require('express');
const { Bank, User } = require('../models/model');

const router = express.Router();

// Get Bank Details Route
router.post('/', async (req, res) => {
  try {
    const { key, accountNumber } = req.body;

    // Validate input
    if (!key || !accountNumber) {
      return res.status(400).json({ message: 'Missing required parameters: secret key and account number' });
    }

    // Find bank by secret key and account number
    const bank = await Bank.findOne({ secret_key: key, account_number: accountNumber });

    if (bank) {
      // Find the user associated with this account number to get the account holder's name
      const user = await User.findOne({ account_number: accountNumber });
      
      // Return bank details with amount and account holder's name
      res.status(200).json({
        amount: bank.amount || 0,
        name: user ? user.name : bank.name, // Use user's name if found, fallback to bank name
        account_number: bank.account_number
      });
    } else {
      res.status(401).json({ message: 'Invalid bank details' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Bank Route
router.post('/add', async (req, res) => {
  try {
    const { name, account_number, secret_key } = req.body;

    // Validate input
    if (!name || !account_number || !secret_key) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if account number already exists
    const existingBank = await Bank.findOne({ account_number });
    if (existingBank) {
      return res.status(400).json({ message: 'Account number already exists' });
    }

    // Create new bank account
    const newBank = new Bank({ 
      name, 
      account_number, 
      secret_key,
      amount: 10000 // Default amount for testing
    });

    const savedBank = await newBank.save();
    res.status(201).json({ 
      message: 'Bank added successfully', 
      bank: {
        name: savedBank.name,
        account_number: savedBank.account_number,
        amount: savedBank.amount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check Secret Key and Account Number Route
router.get('/secret/:key/:accountNumber', async (req, res) => {
  try {
    const { key, accountNumber } = req.params;

    // Validate input
    if (!key || !accountNumber) {
      return res.status(400).json({ message: 'Missing required parameters: secret key and account number' });
    }

    // Find bank by secret key and account number
    const bank = await Bank.findOne({ secret_key: key, account_number: accountNumber });

    if (bank) {
      res.status(200).json({ 
        message: 'Valid bank details',
        amount: bank.amount || 0
      });
    } else {
      res.status(401).json({ message: 'Invalid bank details' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Bank Details to User Route
router.post('/addDetails/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { account_number, secret_key } = req.body;

    // Check if bank account exists
    const bank = await Bank.findOne({ account_number });
    if (!bank) {
      return res.status(400).json({ message: 'Bank account not found' });
    }

    // Verify secret key
    if (bank.secret_key !== secret_key) {
      return res.status(400).json({ message: 'Invalid secret key' });
    }

    // Update user with bank details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        account_number: bank.account_number,
        isAdd: true 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'Bank details added successfully',
      user: {
        account_number: bank.account_number,
        amount: bank.amount || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Bank Amount Route
router.get('/amount/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Get bank account details
    const bank = await Bank.findOne({ account_number: accountNumber });

    if (!bank) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    res.status(200).json({
      amount: bank.amount || 0,
      account_number: bank.account_number
    });
  } catch (error) {
    console.error('Error getting bank amount:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
