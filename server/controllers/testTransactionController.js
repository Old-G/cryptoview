const { check, validationResult } = require('express-validator')
const axios = require('axios')

const getTransactions = async (req, res) => {
	try {
		const { address, startDate, endDate } = req.params

		if (!address) {
			return res.status(400).json({ error: 'Missing wallet address' })
		}

		console.log(`Fetching transactions for address: ${address}`)

		const response = await axios.get(`https://api.etherscan.io/api`, {
			params: {
				module: 'account',
				action: 'txlist',
				address,
				sort: 'desc',
				apikey: process.env.ETHERSCAN_API_KEY,
			},
		})

		console.log('Etherscan API response:', response.data)

		if (!response.data.result || response.data.result.length === 0) {
			return res.status(404).json({ error: 'No transactions found' })
		}

		let transactions = response.data.result

		if (startDate) {
			transactions = transactions.filter(
				tx => tx.timeStamp >= new Date(startDate).getTime() / 1000
			)
		}

		if (endDate) {
			transactions = transactions.filter(
				tx => tx.timeStamp <= new Date(endDate).getTime() / 1000
			)
		}

		res.json(transactions.slice(0, 5))
	} catch (error) {
		console.error('Error fetching transactions:', error)
		res
			.status(500)
			.json({ error: `Error fetching transactions: ${error.message}` })
	}
}

const validateTransactionQuery = [
	check('startDate').optional().isISO8601().withMessage('Invalid start date'),
	check('endDate').optional().isISO8601().withMessage('Invalid end date'),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		next()
	},
]

module.exports = { getTransactions, validateTransactionQuery }
