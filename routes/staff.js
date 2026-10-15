const express = require('express');
const router = express.Router();
const { getAllStaff, getStaff, createStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getAllStaff);
router.get('/:id', isAuthenticated, getStaff);
router.post('/', isAuthenticated, createStaff);
router.put('/:id', isAuthenticated, updateStaff);
router.delete('/:id', isAuthenticated, deleteStaff);

module.exports = router;
