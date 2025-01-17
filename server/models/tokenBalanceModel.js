const mongoose = require('mongoose')

const TokenBalanceSchema = new mongoose.Schema(
	{
		walletAddress: { type: String, required: true },
		contractAddress: { type: String, required: true },
		balance: { type: Number, required: true },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('tokenBalance', TokenBalanceSchema)
