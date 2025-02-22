const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, SupplierProduct } = require('../models/model'); 

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;

    // Input validation
    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate account number for suppliers
    let accountNumber;
    if (user_type.toLowerCase() === 'supplier') {
      accountNumber = await generateAccountNumber();
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      user_type: user_type.toLowerCase(),
      account_number: accountNumber,
      isAdd: false
    });

    await newUser.save();

    // If user is a supplier, create initial empty supplier product entry
    if (user_type.toLowerCase() === 'supplier') {
      const supplierProduct = new SupplierProduct({
        supplier_id: newUser._id,
        user_id: newUser._id,
        product_list: [],
        isVerified: false,
        product_credit: 0
      });
      await supplierProduct.save();
    }

    res.status(201).json({ 
      message: 'User registered successfully',
      user_type: user_type.toLowerCase(),
      account_number: accountNumber 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(user)
    // Generate JWT
    const token = jwt.sign({ userId: user._id, userEmail: user.email }, 'your_secret_key', { expiresIn: '1h' }); 

    res.status(200).json({ token, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Address to User
router.post('/:userId/address', async (req, res) => {
  try {
    const { userId } = req.params;
    const { address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.address.push(address); 
    await user.save();

    res.status(201).json({ message: 'Address added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Addresses of User
router.get('/:userId/addresses', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('address'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ addresses: user.address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); 

    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/supply', async (req, res) => {
  try {
    const supply = await SupplierProduct.find(); 

    if (!supply) {
      return res.status(404).json({ message: 'Supply not found' });
    }

    res.status(200).json(supply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to generate a unique account number
function generateAccountNumber() {
  // Implement your logic to generate a unique 10-digit account number
  // For example:
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); 
}

module.exports = router;