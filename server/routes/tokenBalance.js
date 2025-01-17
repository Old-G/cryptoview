const express = require('express')
const { getTokenBalance } = require('../controllers/tokenBalanceController')

const router = express.Router()

router.get('/:walletAddress/:contractAddress', getTokenBalance)

module.exports = router
