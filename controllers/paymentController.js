const db = require('../config/db');

// Calculate price based on weight
const calculatePrice = (weight, parcel_type) => {
  let base = 250; // Base price LKR
  let perKg = 50;
  if (parcel_type === 'Fragile') perKg = 80;
  if (parcel_type === 'Perishable') perKg = 100;
  return base + (weight * perKg);
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT pay.*, p.tracking_number, p.parcel_type, c.name AS customer_name, c.email AS customer_email
       FROM payments pay
       JOIN parcels p ON pay.parcel_id = p.id
       JOIN customers c ON pay.customer_id = c.id
       ORDER BY pay.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get payment for a parcel
const getParcelPayment = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT pay.*, p.tracking_number, p.weight, p.parcel_type, c.name AS customer_name
       FROM payments pay JOIN parcels p ON pay.parcel_id = p.id JOIN customers c ON pay.customer_id = c.id
       WHERE pay.parcel_id = ?`,
      [req.params.parcelId]
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create payment
const createPayment = async (req, res) => {
  try {
    const { parcel_id, customer_id, payment_method } = req.body;
    if (!parcel_id || !customer_id || !payment_method) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    // Get parcel for price calculation
    const [parcels] = await db.execute('SELECT weight, parcel_type FROM parcels WHERE id = ?', [parcel_id]);
    if (parcels.length === 0) return res.status(404).json({ success: false, message: 'Parcel not found' });

    const amount = calculatePrice(parcels[0].weight, parcels[0].parcel_type);
    const transaction_id = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const [result] = await db.execute(
      'INSERT INTO payments (parcel_id, customer_id, amount, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?)',
      [parcel_id, customer_id, amount, payment_method, transaction_id]
    );
    res.json({ success: true, message: 'Payment record created', id: result.insertId, amount, transaction_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Process payment (mock)
const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM payments WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (rows[0].payment_status === 'Paid') {
      return res.status(400).json({ success: false, message: 'Payment already processed' });
    }
    // Simulate payment processing delay
    await db.execute(
      'UPDATE payments SET payment_status = ?, paid_at = NOW() WHERE id = ?',
      ['Paid', id]
    );
    res.json({ success: true, message: 'Payment processed successfully', transaction_id: rows[0].transaction_id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reports
const getReports = async (req, res) => {
  try {
    const [totalParcels] = await db.execute('SELECT COUNT(*) AS count FROM parcels');
    const [deliveredParcels] = await db.execute("SELECT COUNT(*) AS count FROM parcels WHERE status = 'Delivered'");
    const [pendingParcels] = await db.execute("SELECT COUNT(*) AS count FROM parcels WHERE status = 'Pending'");
    const [totalRevenue] = await db.execute("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE payment_status = 'Paid'");
    const [totalCustomers] = await db.execute('SELECT COUNT(*) AS count FROM customers');
    const [activeStaff] = await db.execute("SELECT COUNT(*) AS count FROM delivery_staff WHERE status = 'Active'");
    const [monthlyRevenue] = await db.execute(
      `SELECT DATE_FORMAT(paid_at, '%Y-%m') AS month, SUM(amount) AS revenue
       FROM payments WHERE payment_status = 'Paid'
       GROUP BY month ORDER BY month DESC LIMIT 6`
    );
    const [statusBreakdown] = await db.execute(
      'SELECT status, COUNT(*) AS count FROM parcels GROUP BY status'
    );
    res.json({
      success: true,
      data: {
        totalParcels: totalParcels[0].count,
        deliveredParcels: deliveredParcels[0].count,
        pendingParcels: pendingParcels[0].count,
        totalRevenue: totalRevenue[0].total,
        totalCustomers: totalCustomers[0].count,
        activeStaff: activeStaff[0].count,
        monthlyRevenue,
        statusBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllPayments, getParcelPayment, createPayment, processPayment, getReports };
