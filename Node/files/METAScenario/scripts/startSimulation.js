const WebSocket = require('ws');
const execa = require("execa")
const Web3 = require('web3')
const web3Admin = require('web3admin')
const fs = require('fs')
const requiredBalance = 9999999999
var abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"students","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myBalance","outputs":[{"name":"myBalance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"generate","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"printAddress","outputs":[{"name":"self","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]')
var provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3Admin.extend(provider)

function waitForContractAddress() {
  var ws
    ws = new WebSocket('ws://xain_contract_deployer:40000')
     ws.on('message', function incoming(address) {
         console.log("-------------------------Address-------------")
         console.log(address)
         startSimulation(address)

     })
  ws.onerror=function(event) {
          console.log("Contract address WebSocket not reachable")
          ws.close()
  }

  ws.onclose=function(event){
      setTimeout(function () {
          waitForContractAddress()
        }, 10000)
  }

}

function startSimulation(address) {
    try {
        if ((provider.eth.getBalance(provider.eth.accounts[0]).toString(10)) > requiredBalance) {
            generateCoins(address)
            setTimeout(function () {
                require("./simulateTransactions")(address)
            }, 10000)
        }
        else {
            setTimeout(function () {
                startSimulation(address)
            }, 10000)
        }
    } catch (error) {
        setTimeout(function () {
            startSimulation(address)
        }, 10000)
    }
}


function generateCoins(address) {
        try {
            const account = provider.eth.accounts[0]
            var coinbasepwd = fs.readFileSync("/root/files/coinbasepwd", "utf8")
            coinbasepwd = coinbasepwd.replace("\n", "")
            var METAScenario = provider.eth.contract(abi).at(address)
            provider.eth.defaultAccount = account
            provider.miner.stop()
            provider.personal.unlockAccount(account, coinbasepwd)
            METAScenario.generate(requiredBalance)
            provider.miner.start()
            setTimeout(function () {
                generateCoins(address)
            }, 1000000)
        } catch(error) {
            provider.miner.start()
            console.log("An error occured during generating coins")
            console.log(error)
            setTimeout(function () {
                generateCoins(address)
            }, 30000)
        }


}
waitForContractAddress()

