const express = require('express');

const AdminUserController = require('../controller/AdminUser');

const router = express.Router();



router.post('/adminLogin',AdminUserController.AdminLogin )

module.exports = router;