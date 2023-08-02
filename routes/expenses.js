const express = require('express');

const expensesController = require('../controller/expenses')

const userauthentication = require('../middleware/auth')

const router = express.Router();

router.get('/getexpenses', userauthentication.authenticate, expensesController.getexpenses )

router.get('/download', userauthentication.authenticate, expensesController.downloadexpenses)

router.get('/downloaddataAllFile',userauthentication.authenticate,expensesController.downloadexpensedataAllFile);


module.exports = router;