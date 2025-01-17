const axios = require('axios')
const { Web3 } = require('web3')
const { check, validationResult } = require('express-validator')

const web3 = new Web3(process.env.INFURA_URL)

const validateNftMetadata = [
	check('contractAddress')
		.isEthereumAddress()
		.withMessage('Invalid contract address'),
	check('tokenId')
		.isInt({ gt: 0 })
		.withMessage('Token ID must be a positive integer'),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		next()
	},
]

const fetchAbiFromEtherscan = async contractAddress => {
	try {
		const response = await axios.get(`https://api.etherscan.io/api`, {
			params: {
				module: 'contract',
				action: 'getabi',
				address: contractAddress,
				apikey: process.env.ETHERSCAN_API_KEY,
			},
		})

		if (response.data.status === '1') {
			return JSON.parse(response.data.result)
		} else {
			throw new Error(`Failed to fetch ABI: ${response.data.message}`)
		}
	} catch (error) {
		console.error(`Error fetching ABI: ${error.message}`)
		throw new Error('Failed to fetch contract ABI')
	}
}

const getNftMetadata = async (req, res) => {
	try {
		const { contractAddress, tokenId } = req.body

		console.log(
			`Fetching metadata for contract: ${contractAddress}, Token ID: ${tokenId}`
		)

		const abi = await fetchAbiFromEtherscan(contractAddress)
		const contract = new web3.eth.Contract(abi, contractAddress)

		let tokenUriMethod = null
		let useCryptoKittiesMethod = false

		abi.forEach(method => {
			if (method.name === 'tokenURI' || method.name === 'uri') {
				tokenUriMethod = method.name
			}
			if (method.name === 'getKitty') {
				useCryptoKittiesMethod = true
			}
		})

		let metadata = {}

		if (tokenUriMethod) {
			const tokenURI = await contract.methods[tokenUriMethod](tokenId).call()
			console.log(`Token URI: ${tokenURI}`)
			metadata = (await axios.get(tokenURI)).data
		} else if (useCryptoKittiesMethod) {
			console.log('Fetching CryptoKitty data...')
			const kittyData = await contract.methods.getKitty(tokenId).call()
			metadata = {
				name: `CryptoKitty #${tokenId}`,
				description: 'A unique CryptoKitty collectible',
				image: `https://api.cryptokitties.co/kitties/${tokenId}.svg`,
				attributes: kittyData,
			}
		} else {
			return res.status(400).json({
				error: 'Contract does not have tokenURI, uri, or getKitty method',
			})
		}

		res.json({
			contractAddress,
			tokenId,
			name: metadata.name || 'Unknown',
			description: metadata.description || 'No description',
			image: metadata.image || 'No image',
		})
	} catch (error) {
		console.error('Error fetching NFT metadata:', error)
		res
			.status(500)
			.json({ error: `Error fetching NFT metadata: ${error.message}` })
	}
}

module.exports = {
	getNftMetadata,
	validateNftMetadata,
}
