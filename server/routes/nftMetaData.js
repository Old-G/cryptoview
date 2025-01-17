const express = require('express')
const {
	getNftMetadata,
	validateNftMetadata,
} = require('../controllers/nftMetaDataController')

const router = express.Router()

router.post('/', validateNftMetadata, getNftMetadata)
module.exports = router
