const Web3 = require('web3')
const Dagger = require('@maticnetwork/dagger')
const env = require('../Config/Env')
const web3 = new Web3(env.ropsten)
const dagger = new Dagger(env.dagger)
const contract = new web3.eth.Contract(env.abi, env.contract)
const dagcontract = dagger.contract(contract);

module.exports = dagcontract