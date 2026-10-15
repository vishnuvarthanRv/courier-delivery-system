const db = require('../config/db');

// Generate tracking number
const generateTrackingNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `CDS-${random}-${year}`;
};

// Get all parcels
const getAllParcels = async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    let query = `SELECT p.*, c.name AS sender_name, c.phone AS sender_phone 
                 FROM parcels p 
                 JOIN customers c ON p.sender_id = c.id`;
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(p.tracking_number LIKE ? OR p.recipient_name LIKE ? OR c.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      conditions.push('p.status = ?');
      params.push(status);
    }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY p.created_at DESC';

    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single parcel
const getParcel = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, c.name AS sender_name, c.phone AS sender_phone, c.email AS sender_email
       FROM parcels p JOIN customers c ON p.sender_id = c.id WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Parcel not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Track parcel by tracking number
const trackParcel = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, c.name AS sender_name,
       (SELECT JSON_ARRAYAGG(JSON_OBJECT('status', th.status, 'location', th.location, 'notes', th.notes, 'updated_at', th.updated_at))
        FROM tracking_history th WHERE th.parcel_id = p.id ORDER BY th.updated_at DESC) AS history
       FROM parcels p JOIN customers c ON p.sender_id = c.id WHERE p.tracking_number = ?`,
      [req.params.trackingNumber]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Parcel not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create parcel
const createParcel = async (req, res) => {
  try {
    const { sender_id, recipient_name, recipient_phone, recipient_address, recipient_city, weight, parcel_type, description } = req.body;
    if (!sender_id || !recipient_name || !recipient_phone || !recipient_address || !weight) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }
    const tracking_number = generateTrackingNumber();
    const [result] = await db.execute(
      `INSERT INTO parcels (tracking_number, sender_id, recipient_name, recipient_phone, recipient_address, recipient_city, weight, parcel_type, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tracking_number, sender_id, recipient_name.trim(), recipient_phone.trim(), recipient_address.trim(),
       recipient_city ? recipient_city.trim() : null, weight, parcel_type || 'Package', description ? description.trim() : null]
    );
    // Add initial tracking history
    await db.execute(
      'INSERT INTO tracking_history (parcel_id, status, location, notes) VALUES (?, ?, ?, ?)',
      [result.insertId, 'Pending', 'Origin', 'Parcel registered in system']
    );
    res.json({ success: true, message: 'Parcel created successfully', id: result.insertId, tracking_number });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update parcel
const updateParcel = async (req, res) => {
  try {
    const { sender_id, recipient_name, recipient_phone, recipient_address, recipient_city, weight, parcel_type, description, status } = req.body;
    const [old] = await db.execute('SELECT status FROM parcels WHERE id = ?', [req.params.id]);
    if (old.length === 0) return res.status(404).json({ success: false, message: 'Parcel not found' });

    await db.execute(
      `UPDATE parcels SET sender_id=?, recipient_name=?, recipient_phone=?, recipient_address=?, recipient_city=?,
       weight=?, parcel_type=?, description=?, status=? WHERE id=?`,
      [sender_id, recipient_name.trim(), recipient_phone.trim(), recipient_address.trim(),
       recipient_city ? recipient_city.trim() : null, weight, parcel_type, description ? description.trim() : null, status, req.params.id]
    );
    // Add tracking history if status changed
    if (old[0].status !== status) {
      await db.execute(
        'INSERT INTO tracking_history (parcel_id, status, notes) VALUES (?, ?, ?)',
        [req.params.id, status, `Status updated to ${status}`]
      );
    }
    res.json({ success: true, message: 'Parcel updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete parcel
const deleteParcel = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM parcels WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Parcel not found' });
    res.json({ success: true, message: 'Parcel deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllParcels, getParcel, trackParcel, createParcel, updateParcel, deleteParcel };
