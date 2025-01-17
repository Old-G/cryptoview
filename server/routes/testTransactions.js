const express = require('express')
const {
	getTransactions,
	validateTransactionQuery,
} = require('../controllers/testTransactionController')

const router = express.Router()

router.get('/:address', validateTransactionQuery, getTransactions)

module.exports = router
