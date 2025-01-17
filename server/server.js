const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const workoutRoutes = require('./routes/workouts.js')
const usersRoutes = require('./routes/users.js')
const transactionsRoutes = require('./routes/transactions')
const userPortfolio = require('./routes/userPortfolio.js')
const nftMetaData = require('./routes/nftMetaData.js')
const testTransactions = require('./routes/testTransactions.js')
const tokenBalanceRoutes = require('./routes/tokenBalance.js')

dotenv.config()

const app = express()

// CORS configurations
const corsOptions = {
	origin: ['http://localhost:5173', 'https://api.coingecko.com/'],
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
// Middleware
app.use(express.json())

// Logger Middleware
app.use((req, res, next) => {
	console.log(req.path, req.method)
	next()
})

// Routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/portfolio', userPortfolio)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/nftData', nftMetaData)
app.use('/api/testTransactions', testTransactions)
app.use('/api/tokenBalance', tokenBalanceRoutes)

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app
