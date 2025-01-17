const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
	{
		hash: { type: String, required: true, unique: true },
		from: { type: String, required: true },
		to: { type: String, required: true },
		value: { type: String },
		timestamp: { type: String },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('testTransaction', TransactionSchema)
