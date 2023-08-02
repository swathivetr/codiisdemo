const express = require('express');

const expenseController = require('../controller/expense')

const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addexpense', userauthentication.authenticate, expenseController.addexpense )

router.get('/getexpenses', userauthentication.authenticate, expenseController.getexpenses )

router.delete('/deleteexpense/:expenseid', userauthentication.authenticate, expenseController.deleteexpense )

router.get('/upload', userauthentication.authenticate, expenseController.uploadexpense)

router.get('/uploddataAllFile',userauthentication.authenticate,expenseController.uploadexpensedataAllFile);


module.exports = router;