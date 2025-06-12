// Authentication and role-based registration endpoints

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   POST api/auth/register
// @desc    Register a user with role-based fields
// @access  Public
router.post('/register', [
  // Common validation for all users
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('role', 'Role is required').isIn(['student', 'admin']),
  
  // Custom validation based on role
  (req, res, next) => {
    const { role } = req.body;
    
    if (role === 'student') {
      // Student-specific validation
      check('studentId', 'Student ID is required').not().isEmpty()(req, res, () => {});
      check('major', 'Major is required').not().isEmpty()(req, res, () => {});
      check('year', 'Year is required').not().isEmpty()(req, res, () => {});
    } else if (role === 'admin') {
      // Admin-specific validation
      check('department', 'Department is required').not().isEmpty()(req, res, () => {});
      check('position', 'Position is required').not().isEmpty()(req, res, () => {});
      check('employeeId', 'Employee ID is required').not().isEmpty()(req, res, () => {});
    }
    
    next();
  }
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { 
    name, 
    email, 
    password, 
    role,
    // Student fields
    studentId,
    major,
    year,
    // Admin fields
    department,
    position,
    employeeId
  } = req.body;
  
  try {
    // Check if user already exists
let user = await User.findOne({ email }).select('+password');
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    
    // Create user object based on role
    user = new User({
      name,
      email,
      password,
      role,
      ...(role === 'student' 
        ? { studentId, major, year } 
        : { department, position, employeeId })
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Save user to database
    await user.save();
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    // Sign and return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// @route   POST api/auth/register
// @desc    Register a user with role-based fields
// @access  Public
router.post(
  '/register',
  [
    // Common validation for all users
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['student', 'admin']),

    // Custom validation based on role (ensure this part is correct and not causing issues)
    (req, res, next) => {
      const { role } = req.body;

      if (role === 'student') {
        check('studentId', 'Student ID is required').not().isEmpty()(req, res, () => {});
        check('major', 'Major is required').not().isEmpty()(req, res, () => {});
        check('year', 'Year is required').not().isEmpty()(req, res, () => {});
      } else if (role === 'admin') {
        check('department', 'Department is required').not().isEmpty()(req, res, () => {});
        check('position', 'Position is required').not().isEmpty()(req, res, () => {});
        check('employeeId', 'Employee ID is required').not().isEmpty()(req, res, () => {});
      }

      next();
    },
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[Backend Register Log] Validation errors:', errors.array()); // ADD THIS LOG
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      role,
      studentId,
      major,
      year,
      department,
      position,
      employeeId,
    } = req.body;

    try {
      console.log(`[Backend Register Log] Attempting to register user with email: ${email}`); // ADD THIS LOG

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        console.log('[Backend Register Log] User already exists.'); // ADD THIS LOG
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create user object based on role
      user = new User({
        name,
        email,
        password,
        role,
        ...(role === 'student'
          ? { studentId, major, year }
          : { department, position, employeeId }),
      });

      // Hash password (this is also handled by pre-save hook in User model, but keeping for now)
      // const salt = await bcrypt.genSalt(10);
      // user.password = await bcrypt.hash(password, salt);
      console.log('[Backend Register Log] User object created, attempting to save...'); // ADD THIS LOG

      // Save user to database
      await user.save();
      console.log('[Backend Register Log] User saved to database successfully!'); // ADD THIS LOG

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      // Sign and return JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) {
            console.error('[Backend Register Log] JWT signing error:', err.message); // ADD THIS LOG
            throw err;
          }
          console.log('[Backend Register Log] JWT signed, sending response.'); // ADD THIS LOG
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('[Backend Register Log] Server error during registration - Type:', err.name); // MODIFY THIS LOG
      console.error('[Backend Register Log] Server error during registration - Message:', err.message); // MODIFY THIS LOG
      console.error('[Backend Register Log] Server error during registration - Stack:', err.stack); // MODIFY THIS LOG
      res.status(500).send('Server error');
    }
  }
);
// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { 
    name, 
    // Student fields
    major,
    year,
    // Admin fields
    department,
    position
  } = req.body;
  
  try {
    // Get user
    const user = await User.findById(req.user.id);
    
    // Update fields
    if (name) user.name = name;
    
    // Update role-specific fields
    if (user.role === 'student') {
      if (major) user.major = major;
      if (year) user.year = year;
    } else if (user.role === 'admin') {
      if (department) user.department = department;
      if (position) user.position = position;
    }
    
    user.updatedAt = Date.now();
    
    // Save user
    await user.save();
    
    // Return updated user without password
    res.json(await User.findById(req.user.id).select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/logout
// @desc    Logout user (client-side only in JWT)
// @access  Public
router.post('/logout', (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint is for consistency and future extensions
  res.json({ msg: 'Logout successful' });
});

module.exports = router;
