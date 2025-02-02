const mongoose = require('mongoose')

const NftMetadataSchema = new mongoose.Schema(
	{
		contractAddress: { type: String, required: true },
		tokenId: { type: String, required: true },
		name: { type: String },
		description: { type: String },
		image: { type: String },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('nftMetaData', NftMetadataSchema)
