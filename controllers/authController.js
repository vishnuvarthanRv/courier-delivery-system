const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    const [rows] = await db.execute('SELECT * FROM admins WHERE username = ? OR email = ?', [username, username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const admin = rows[0];
    // Support both bcrypt hashed and plain text passwords
    let isMatch = false;
    if (admin.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      isMatch = (password === admin.password);
    }
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // If plain text, auto-upgrade to bcrypt hash
    if (!admin.password.startsWith('$2')) {
      const hashed = await bcrypt.hash(password, 10);
      await db.execute('UPDATE admins SET password = ? WHERE id = ?', [hashed, admin.id]);
    }
    req.session.admin = { id: admin.id, username: admin.username, email: admin.email, role: admin.role };
    res.json({ success: true, message: 'Login successful', admin: req.session.admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

// Check session
const checkSession = (req, res) => {
  if (req.session.admin) {
    res.json({ success: true, admin: req.session.admin });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
};

module.exports = { login, logout, checkSession };
