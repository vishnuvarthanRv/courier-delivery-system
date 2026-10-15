const express = require('express');
const router = express.Router();
const { login, logout, checkSession } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/session', checkSession);

module.exports = router;
