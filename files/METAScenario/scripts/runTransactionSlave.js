const WebSocketServer = require('ws').Server
const Web3 = require('web3')
const request = require('request')
const ip = require('ip')
const web3Admin = require('web3admin')
const fs = require('fs')
const abi = require('../contractAbi.json')
const sleepSeconds = require('sleepjs').sleepSeconds


module.exports = function (address) {

  const provider = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  web3Admin.extend(provider)
  function initialize () {
    try {
      const coinbasepwd = fs.readFileSync('/root/files/coinbasepwd', 'utf8')
        .replace('\n', '')
      const METAScenario = provider.eth.contract(abi)
        .at(address)
      provider.eth.defaultAccount = provider.eth.accounts[0]
      const ipAddress = {
        ipAddress: ip.address()
          .toString(),
      }
      request({
        url: 'http://xain_contract_deployer:60000',
        method: 'POST',
        json: true,
        body: ipAddress,
      }, (error) => {
        if (error) {
          console.log(error)
        }
        console.log('connected')
      })
      startws(METAScenario, coinbasepwd)
    }
    catch (error) {
      sleepSeconds(20)
        .then(() => {
          console.log('Default account could not be set. Retrying')
          initialize()
        })
    }
  }


  function startws (_METAScenario, coinbasepwd) {
    console.log('!!!!! Started Websocket')
    const wsServer = new WebSocketServer({port: 20001})
    wsServer.on('connection', (socket) => {
      socket.on('message', (data) => {
        try {
          console.log(data)
          console.log('!!!!!!!!!!!!!Doing transaction')
          provider.miner.stop()
          provider.personal.unlockAccount(provider.eth.accounts[0], coinbasepwd)
          const output = _METAScenario
            .transfer('0x007ccffb7916f37f7aeef05e8096ecfbe55afc2f', 1, data)
          provider.miner.start()
          console.log(output)
        }
        catch (error) {
          console.log('!!!!!!!!!!!!!!!!!Transaction failed!!!!!!!!!')
          console.log(error)
        }
      })
      socket.onerror = (error) => {
        console.error(error)
        sleepSeconds(20)
          .then(() => {
            socket.close()
            startws()
          })
      }
    })
  }

  initialize()
}

