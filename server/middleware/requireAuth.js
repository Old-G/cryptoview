const jwt = require('jsonwebtoken')
const process = require('process')
const userModel = require('../models/userModel.js')

const requireAuth = async (req, res, next) => {
	console.log('Skipping auth verification')
	next()
}

module.exports = requireAuth
