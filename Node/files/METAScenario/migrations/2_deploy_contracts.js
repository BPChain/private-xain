const ws = require('ws')
const WebSocketServer = ws.Server
const execa = require("execa")
const Web3 = require('web3')

const METAScenario = artifacts.require("../contracts/METAScenario.sol");

module.exports = function (deployer) {
    var address
    var provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    provider.eth.getBalance("46dfb921f8f7edbbd8100458b7c1beefeabf6e15")
    provider.personal.unlockAccount(provider.eth.accounts[0], "1234567890");

    return deployer.deploy(METAScenario).then(function () {
        return METAScenario.deployed()
            .then(function (instance) {
                address = instance.address
                return address
            }).then(function () {
                const wsServer = new WebSocketServer({port: 40000})
                wsServer.on('connection', function (connection) {
                    connection.send(address)
                })
            })
    })
}

