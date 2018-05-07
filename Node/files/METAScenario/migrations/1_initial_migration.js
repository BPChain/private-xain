var Migrations = artifacts.require("./Migrations.sol");
const Web3 = require('web3')

module.exports = function(deployer) {
  var provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  setInterval(function() {
        try {
            provider.eth.defaultAccount = provider.eth.accounts[0];
          if(provider.eth.getBalance(provider.eth.accounts[0]) > 100000) {
              clearInterval();
              provider.miner.stop();
              provider.eth.defaultAccount = provider.eth.accounts[0];
              provider.personal.unlockAccount(provider.eth.accounts[0], "1234567890");
              deployer.deploy(Migrations);
          }

        } catch(error){
            console.log(error)
        }
      }, 10000);

};
