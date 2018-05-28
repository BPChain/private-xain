const WebSocket = require('ws')
const Web3 = require('web3')
const web3Admin = require('web3admin')
const fs = require('fs')
const requiredBalance = 9999999999
const abi = require('../contractAbi.json')
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
    setTimeout(() => {
      waitForContractAddress()
    }, 10000)
  }

}

function startSimulation (address) {
  try {
    if (provider.eth.getBalance(provider.eth.accounts[0])
      .toString(10) > requiredBalance) {
      generateCoins(address)
      setTimeout(() => {
        require('./runTransactionSlave')(address)
      }, 10000)
    }
    else {
      setTimeout(() => {
        startSimulation(address)
      }, 10000)
    }
  }
  catch (error) {
    setTimeout(() => {
      startSimulation(address)
    }, 10000)
  }
}


function generateCoins (address) {
  try {
    const account = provider.eth.accounts[0]
    let coinbasepwd = fs.readFileSync('/root/files/coinbasepwd', 'utf8')
    coinbasepwd = coinbasepwd.replace('\n', '')
    const METAScenario = provider.eth.contract(abi)
      .at(address)
    provider.eth.defaultAccount = account
    provider.miner.stop()
    provider.personal.unlockAccount(account, coinbasepwd)
    METAScenario.generate(requiredBalance)
    provider.miner.start()
    setTimeout(() => {
      generateCoins(address)
    }, 1000000)
  }
  catch (error) {
    provider.miner.start()
    console.log('An error occured during generating coins')
    console.log(error)
    setTimeout(() => {
      generateCoins(address)
    }, 30000)
  }


}
waitForContractAddress()

