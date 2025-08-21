const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER USER
exports.registerUser = (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error during SELECT:', err);
      return res.status(500).json({ error: err.message || err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password, role, company, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [name, email, hashedPassword, role || 'user', company || null],
        (err, results) => {
          if (err) {
            console.error('Error during INSERT:', err);
            return res.status(500).json({ error: err.message || err });
          }
          console.log('User inserted, results:', results);
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    } catch (hashErr) {
      console.error('Error hashing password:', hashErr);
      res.status(500).json({ error: hashErr.message });
    }
  });
};

// LOGIN USER
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const accessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login successful',
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company || 'Not provided'
        }
      });
    } catch (compareErr) {
      res.status(500).json({ error: compareErr.message });
    }
  });
};

// GET USER DATA
exports.getUser = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT id, name, email, role, company FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company || 'Not provided'
    });
  });
};