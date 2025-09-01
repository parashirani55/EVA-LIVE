// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

// Routers
const activeCallsRouter = require('./routes/activeCalls');
const callHistoryRouter = require('./routes/callHistory');
const campaignsRouter = require('./routes/campaigns');
const twilioStatusRoutes = require('./routes/twilioStatus');
const twilioRoutes = require('./routes/twilio');
const attachTwilioStream = require('./routes/twilioStream');

const app = express();
const server = http.createServer(app);

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- JWT Verification Middleware ----------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('Decoded JWT payload:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ---------- MySQL connection pool ----------
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || '3310',
  password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aivoicecaller'
});

// Test connection
(async () => {
  try {
    await db.query('SELECT 1');
    console.log(`✅ MySQL connected to database: ${process.env.DB_NAME || 'aivoicecaller'}`);
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
})();

// ---------- Auth: Register ----------
app.post('/api/register', async (req, res) => {
  const { name, company, email, password, role } = req.body;
  console.log('Register payload:', { name, company, email, role });
  if (!name || !company || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }
  try {
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (name, company, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, company, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Auth: Login ----------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      console.log('No user found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = results[0];
    console.log('Found user:', { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        role: user.role || 'user',
        company: user.company || 'Not provided'
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- Token Refresh ----------
app.post('/api/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }
  try {
    const [results] = await db.execute('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
    if (results.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });
      const newAccessToken = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, company: user.company },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- Get User Data ----------
app.get('/api/user', verifyToken, async (req, res) => {
  const userId = req.user.id;
  console.log('Fetching user data for ID:', userId);
  try {
    const [results] = await db.execute('SELECT id, name, email, role, company FROM users WHERE id = ?', [userId]);
    if (results.length === 0) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    const user = results[0];
    console.log('User data retrieved:', user);
    res.json({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email,
      role: user.role || 'user',
      company: user.company || 'Not provided'
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- Update User Profile ----------
app.post('/api/user', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { name, email, company, password, confirmPassword } = req.body;
  console.log('Update profile payload:', { userId, name, email, company, hasPassword: !!password });

  if (!name || !email || !company) {
    return res.status(400).json({ message: 'Name, email, and company are required' });
  }
  if (password && password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  if (password && password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const [existingEmail] = await db.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email is already in use by another user' });
    }

    let query = 'UPDATE users SET name = ?, email = ?, company = ?';
    const params = [name, email, company];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await db.execute(query, params);

    const [updatedUser] = await db.execute('SELECT id, name, email, role, company FROM users WHERE id = ?', [userId]);
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found after update' });
    }

    const user = updatedUser[0];
    console.log('Updated user data:', user);
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        role: user.role || 'user',
        company: user.company || 'Not provided'
      }
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- Active Calls API ----------
app.get('/api/active-calls', async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM calls WHERE status IN ('Speaking', 'Listening') ORDER BY started_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching active calls:', err);
    res.status(500).json({ message: 'Error fetching active calls', error: err.message });
  }
});

// ---------- Call History API ----------
app.get('/api/call-history', async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM calls WHERE status NOT IN ('Speaking', 'Listening') ORDER BY started_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching call history:', err);
    res.status(500).json({ message: 'Error fetching call history', error: err.message });
  }
});

// ---------- Dashboard Stats API ----------
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        COUNT(*) AS total_calls,
        SUM(status IN ('Answered','Speaking','Listening','completed')) AS answered_calls,
        SUM(status IN ('No Answer','Failed','Error','Busy')) AS failed_calls,
        ROUND(AVG(NULLIF(duration, 0))) AS avg_seconds
      FROM calls
      WHERE DATE(started_at) = CURDATE()
    `);

    const s = rows?.[0] || {};
    const avgSec = Number(s.avg_seconds || 0);
    const minutes = Math.floor(avgSec / 60);
    const seconds = avgSec % 60;

    const [weeklyData] = await db.query(`
      SELECT 
        DATE_FORMAT(started_at, '%a') AS name,
        COUNT(*) AS calls
      FROM calls
      WHERE started_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(started_at)
      ORDER BY DATE(started_at)
    `);

    res.json({
      stats: [
        { title: 'Total Calls', value: s.total_calls || 0, change: 'Today', icon: 'Phone' },
        { title: 'Answered Calls', value: s.answered_calls || 0, change: 'Today', icon: 'CheckCircle' },
        { title: 'Failed Calls', value: s.failed_calls || 0, change: 'Today', icon: 'XCircle' },
        { title: 'Avg Duration', value: `${minutes}m ${seconds}s`, change: 'Today', icon: 'Clock' }
      ],
      callData: weeklyData
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- Static files & routers ----------
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".wav")) {
      res.setHeader("Content-Type", "audio/x-wav"); // Twilio-compatible Content-Type
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    if (filePath.endsWith(".mp3")) {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  }
}));

app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.use('/api/campaigns', campaignsRouter);
app.use('/api/active-calls', activeCallsRouter);
app.use('/api/call-history', callHistoryRouter);
app.use('/twilio', twilioStatusRoutes);
app.use('/twilio', twilioRoutes);

// ---------- Attach WebSocket for Twilio Media Streams ----------
attachTwilioStream(server);

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});