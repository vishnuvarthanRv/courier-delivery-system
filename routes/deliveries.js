const express = require('express');
const router = express.Router();
const { getAllDeliveries, getDelivery, createDelivery, updateDelivery, deleteDelivery } = require('../controllers/deliveryController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAllDeliveries);
router.get('/:id', isAuthenticated, getDelivery);
router.post('/', isAuthenticated, createDelivery);
router.put('/:id', isAuthenticated, updateDelivery);
router.delete('/:id', isAuthenticated, deleteDelivery);

module.exports = router;
