const db = require('../config/db');

// Get all deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    let query = `SELECT d.*, p.tracking_number, p.recipient_name, p.recipient_city, p.parcel_type,
                 s.name AS staff_name, s.vehicle_type
                 FROM deliveries d
                 JOIN parcels p ON d.parcel_id = p.id
                 JOIN delivery_staff s ON d.staff_id = s.id`;
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(p.tracking_number LIKE ? OR p.recipient_name LIKE ? OR s.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      conditions.push('d.status = ?');
      params.push(status);
    }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY d.created_at DESC';

    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single delivery
const getDelivery = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.*, p.tracking_number, p.recipient_name, p.recipient_phone, p.recipient_address, p.recipient_city,
       p.parcel_type, p.weight, s.name AS staff_name, s.phone AS staff_phone, s.vehicle_type
       FROM deliveries d JOIN parcels p ON d.parcel_id = p.id JOIN delivery_staff s ON d.staff_id = s.id WHERE d.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create delivery (assign parcel to staff)
const createDelivery = async (req, res) => {
  try {
    const { parcel_id, staff_id, assigned_date, notes } = req.body;
    if (!parcel_id || !staff_id || !assigned_date) {
      return res.status(400).json({ success: false, message: 'Parcel, staff and assigned date are required' });
    }
    // Check parcel exists
    const [parcel] = await db.execute('SELECT id, status FROM parcels WHERE id = ?', [parcel_id]);
    if (parcel.length === 0) return res.status(404).json({ success: false, message: 'Parcel not found' });

    const [result] = await db.execute(
      'INSERT INTO deliveries (parcel_id, staff_id, assigned_date, notes) VALUES (?, ?, ?, ?)',
      [parcel_id, staff_id, assigned_date, notes ? notes.trim() : null]
    );
    // Update parcel status
    await db.execute('UPDATE parcels SET status = ? WHERE id = ?', ['Picked Up', parcel_id]);
    await db.execute(
      'INSERT INTO tracking_history (parcel_id, status, notes) VALUES (?, ?, ?)',
      [parcel_id, 'Picked Up', `Assigned to delivery staff`]
    );
    res.json({ success: true, message: 'Delivery assigned successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update delivery status
const updateDelivery = async (req, res) => {
  try {
    const { staff_id, assigned_date, delivery_date, notes, status } = req.body;
    const [rows] = await db.execute('SELECT * FROM deliveries WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Delivery not found' });

    await db.execute(
      'UPDATE deliveries SET staff_id=?, assigned_date=?, delivery_date=?, notes=?, status=? WHERE id=?',
      [staff_id, assigned_date, delivery_date || null, notes ? notes.trim() : null, status, req.params.id]
    );
    // Sync parcel status
    const parcelStatusMap = {
      'Assigned': 'Picked Up', 'Picked Up': 'Picked Up',
      'In Transit': 'In Transit', 'Delivered': 'Delivered', 'Failed': 'Failed'
    };
    if (parcelStatusMap[status]) {
      await db.execute('UPDATE parcels SET status = ? WHERE id = ?', [parcelStatusMap[status], rows[0].parcel_id]);
      await db.execute(
        'INSERT INTO tracking_history (parcel_id, status, notes) VALUES (?, ?, ?)',
        [rows[0].parcel_id, parcelStatusMap[status], `Delivery status updated to ${status}`]
      );
    }
    res.json({ success: true, message: 'Delivery updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete delivery
const deleteDelivery = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM deliveries WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, message: 'Delivery deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllDeliveries, getDelivery, createDelivery, updateDelivery, deleteDelivery };
