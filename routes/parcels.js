const express = require('express');
const router = express.Router();
const { getAllParcels, getParcel, trackParcel, createParcel, updateParcel, deleteParcel } = require('../controllers/parcelController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/track/:trackingNumber', trackParcel); // Public tracking
router.get('/', isAuthenticated, getAllParcels);
router.get('/:id', isAuthenticated, getParcel);
router.post('/', isAuthenticated, createParcel);
router.put('/:id', isAuthenticated, updateParcel);
router.delete('/:id', isAuthenticated, deleteParcel);

module.exports = router;
