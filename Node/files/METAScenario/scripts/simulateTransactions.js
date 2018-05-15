const WebSocketServer = require('ws').Server
const Web3 = require('web3')
const request = require('request')
const ip = require('ip')
const web3Admin = require('web3admin')
const fs = require('fs')

module.exports = function (address) {

    var provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    web3Admin.extend(provider)
    var abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"students","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myBalance","outputs":[{"name":"myBalance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"generate","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"printAddress","outputs":[{"name":"self","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]')

    function initialize() {
        try {
            var coinbasepwd = fs.readFileSync("/root/files/coinbasepwd", "utf8")
            coinbasepwd = coinbasepwd.replace("\n", "")
            let METAScenario = provider.eth.contract(abi).at(address);
            provider.eth.defaultAccount = provider.eth.accounts[0];
            let ip_address = {ipAddress: ip.address().toString()}
            request({
                url: "http://xain_contract_deployer:60000",
                method: "POST",
                json: true,
                body: ip_address
            }, function (error, response, body) {
                try {
                    console.log(error)
                }
                catch (error) {

                }
                console.log('connected')

            });
            startws(METAScenario, coinbasepwd)
        }
        catch
            (error) {
            setTimeout(function () {
                console.log("Default account could not be set. Retrying")
                initialize()
            }, 20000)
        }
    }


    function startws(_METAScenario, coinbasepwd) {
        console.log('!!!!! Started Websocket')
        let wsServer= new WebSocketServer({port: 20001})
        wsServer.on('connection', function connection(socket) {
            socket.on('message', function incoming(data) {
                console.log(data)
                console.log('!!!!!!!!!!!!!Doing transaction')
                provider.miner.stop()
                provider.personal.unlockAccount(provider.eth.accounts[0], coinbasepwd)
                let output = _METAScenario.transfer('0x007ccffb7916f37f7aeef05e8096ecfbe55afc2f', 1, data)
                provider.miner.start()
                console.log(output)
            })
            socket.onerror = function (error) {
                setTimeout(function () {
                    socket.close()
                    startws()
                }, 10000)
            }
        })
    }

    initialize()
}

