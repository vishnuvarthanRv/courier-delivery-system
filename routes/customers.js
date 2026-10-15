const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAllCustomers);
router.get('/:id', isAuthenticated, getCustomer);
router.post('/', isAuthenticated, createCustomer);
router.put('/:id', isAuthenticated, updateCustomer);
router.delete('/:id', isAuthenticated, deleteCustomer);

module.exports = router;
