const express = require('express');
const router = express.Router();
const { getAllPayments, getParcelPayment, createPayment, processPayment, getReports } = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/reports', isAuthenticated, getReports);
router.get('/', isAuthenticated, getAllPayments);
router.get('/parcel/:parcelId', isAuthenticated, getParcelPayment);
router.post('/', isAuthenticated, createPayment);
router.put('/:id/process', isAuthenticated, processPayment);

module.exports = router;
