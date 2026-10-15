const db = require('../config/db');

// Get all staff
const getAllStaff = async (req, res) => {
  try {
    const search = req.query.search || '';
    let query = 'SELECT * FROM delivery_staff';
    let params = [];
    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR vehicle_type LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single staff
const getStaff = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM delivery_staff WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create staff
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, vehicle_type, license_number, status } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email and phone are required' });
    }
    const [result] = await db.execute(
      'INSERT INTO delivery_staff (name, email, phone, vehicle_type, license_number, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), phone.trim(), vehicle_type || 'Bike', license_number ? license_number.trim() : null, status || 'Active']
    );
    res.json({ success: true, message: 'Staff created successfully', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update staff
const updateStaff = async (req, res) => {
  try {
    const { name, email, phone, vehicle_type, license_number, status } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email and phone are required' });
    }
    const [result] = await db.execute(
      'UPDATE delivery_staff SET name=?, email=?, phone=?, vehicle_type=?, license_number=?, status=? WHERE id=?',
      [name.trim(), email.trim(), phone.trim(), vehicle_type, license_number ? license_number.trim() : null, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, message: 'Staff updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM delivery_staff WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllStaff, getStaff, createStaff, updateStaff, deleteStaff };
