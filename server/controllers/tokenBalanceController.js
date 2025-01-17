const { Web3 } = require('web3')
const axios = require('axios')

const web3 = new Web3(process.env.INFURA_URL)

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

const getTokenBalance = async (req, res) => {
	try {
		const { walletAddress, contractAddress } = req.params

		if (
			!web3.utils.isAddress(walletAddress) ||
			!web3.utils.isAddress(contractAddress)
		) {
			return resc
				.status(400)
				.json({ error: 'Invalid wallet or contract address' })
		}

		console.log(
			`Fetching token balance for wallet: ${walletAddress}, contract: ${contractAddress}`
		)

		const abi = await fetchAbiFromEtherscan(contractAddress)
		const contract = new web3.eth.Contract(abi, contractAddress)

		const balance = await contract.methods.balanceOf(walletAddress).call()

		let decimals = 18 // По умолчанию ставим 18, если метод `decimals` отсутствует
		try {
			decimals = await contract.methods.decimals().call()
		} catch (e) {
			console.warn('Decimals method not found, using default 18')
		}

		// Приведение BigInt к Number, чтобы избежать ошибок с делением
		const formattedBalance = Number(balance) / 10 ** Number(decimals)

		res.json({ walletAddress, contractAddress, balance: formattedBalance })
	} catch (error) {
		console.error('Error fetching token balance:', error)
		res
			.status(500)
			.json({ error: `Error fetching token balance: ${error.message}` })
	}
}

module.exports = { getTokenBalance }
