const WebSocket = require('ws')
const Web3 = require('web3')
const web3Admin = require('web3admin')
const fs = require('fs')
const requiredBalance = 9999999999
const abi = require('../contractAbi.json')
const sleepSeconds = require('sleepjs').sleepSeconds
const sleepMinutes = require('sleepjs').sleepMinutes
const provider = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
web3Admin.extend(provider)

function waitForContractAddress () {
  const ws = new WebSocket('ws://xain_contract_deployer:40000')
  ws.on('message', (address) => {
    console.log('-------------------------Address-------------')
    console.log(address)
    startSimulation(address)

  })
  ws.onerror = function () {
    console.log('Contract address WebSocket not reachable')
    ws.close()
  }

  ws.onclose = function () {
    sleepSeconds(10)
      .then(waitForContractAddress)
  }

}

function startSimulation (address) {
  try {
    if (provider.eth.getBalance(provider.eth.accounts[0])
      .toString(10) > requiredBalance) {
      generateCoins(address)
      require('./runTransactionSlave')(address)
    }
    else {
      sleepSeconds(10)
        .then(() => startSimulation(address))
    }
  }
  catch (error) {
    sleepSeconds(10)
      .then(() => startSimulation(address))
  }
}


function generateCoins (address) {
  try {
    const account = provider.eth.accounts[0]
    const coinbasepwd = fs
      .readFileSync('/root/files/coinbasepwd', 'utf8')
      .replace('\n', '')
    const METAScenario = provider.eth.contract(abi)
      .at(address)
    provider.eth.defaultAccount = account
    provider.miner.stop()
    provider.personal.unlockAccount(account, coinbasepwd)
    METAScenario.generate(requiredBalance)
    provider.miner.start()
    sleepMinutes(10)
      .then(() => generateCoins(address))
  }
  catch (error) {
    provider.miner.start()
    console.log('An error occured during generating coins')
    console.log(error)
    sleepSeconds(30)
      .then(() => generateCoins(address))
  }


}
waitForContractAddress()

