const db = require('../config/db');

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const search = req.query.search || '';
    let query = 'SELECT * FROM customers';
    let params = [];
    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR city LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single customer
const getCustomer = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, city } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    const [result] = await db.execute(
      'INSERT INTO customers (name, email, phone, address, city) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), phone.trim(), address.trim(), city ? city.trim() : null]
    );
    res.json({ success: true, message: 'Customer created successfully', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, city } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const [result] = await db.execute(
      'UPDATE customers SET name=?, email=?, phone=?, address=?, city=? WHERE id=?',
      [name.trim(), email.trim(), phone.trim(), address.trim(), city ? city.trim() : null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
