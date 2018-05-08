const WebSocket = require('ws');
const iterationTime = process.argv[2]
const execa = require("execa")
var abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"students","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"myBalance","outputs":[{"name":"myBalance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"generate","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"printAddress","outputs":[{"name":"self","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]')

function start() {
  var ws
    ws = new WebSocket('ws://eth_contract_deployer:40000')
     ws.on('message', function incoming(address) {
          console.log("-------------------------Address-------------")
          console.log(address)
             generateCoins(address)
          require("./simulateTransactions")(address, iterationTime)
     })
  ws.onerror=function(event) {
          console.log("Contract address WebSocket not reachable");
          ws.close()
  }

  ws.onclose=function(event){
      setTimeout(function () {
          start()
        }, 10000)
  }

}

function generateCoins(address) {

        var METAScenario = provider.eth.contract(abi).at(address);
        METAScenario.generate(99999999999)
             setTimeout(function () {
                generateCoins(address)
            }, 10000)


}
start()

