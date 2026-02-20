const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/UserSchema');
const { body, validationResult } = require('express-validator');
const EventEmitter = require('events');
require('dotenv').config();

EventEmitter.defaultMaxListeners = 15;

const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  '/createuser',
  [
    body('email', 'Invalid email').isEmail(),
    body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const db = global.dbClient.db("gofoodmern"); // Use the global client to access the database
      const existingUser = await db.collection('users').findOne({ email: req.body.email });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        location: req.body.location,
      };

      // Insert the new user into the 'users' collection
      const result = await db.collection('users').insertOne(user);
      
      const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '1h' });

      res.send({
        message: 'User created successfully',
        token,
        user: { ...user, _id: result.insertedId }, // Include the newly created user with the generated _id
      });
    } catch (error) {
      console.error('Error during user creation:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post('/login', async (req, res) => {
  try {
    const db = global.dbClient.db("gofoodmern");
    const user = await db.collection('users').findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const data = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });
    
    return res.send({
      message: 'User logged in successfully',
      authToken: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; 
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
};

router.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;
