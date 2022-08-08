const express = require('express')
const jwt = require('jsonwebtoken')
const TokenValidation = require('../repositories/TokenValidation')

module.exports = async (req, res, next) => {
    const token = await TokenValidation(req.headers.authorization);
    if(typeof token == 'object'){
        return res.status(400).json(token)
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ Error: 'Token invalid' })
        }
        req.userId = decoded.id
        return next()
    })
}