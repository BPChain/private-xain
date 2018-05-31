
# private xain


Master-Branch: [![Build Status](https://travis-ci.org/BPChain/private-xain.svg?branch=master)](https://travis-ci.org/BPChain/private-xain) <br />
Dev-Branch: [![Build Status](https://travis-ci.org/BPChain/private-xain.svg?branch=dev)](https://travis-ci.org/BPChain/private-xain)  <br />

### Structure
Run Xain in docker. We have three different docker images. Eth_node for running a blockchain node. Eth_contract_deployer for running the scenario simulation and bootstrap for initializing the blockchain and interconnecting all eth_nodes.

### Xain_node files
1. ['blockchain_accounts'](https://github.com/BPChain/private-xain/tree/master/keys) are required for each blockchain node to start mining and participate in smart contracts. The XAIN implementation requires specific accounts which cannot be created by geth automatically. Therefore these accounts are fixed for each blockchain node.
2. [`data_collection`](https://github.com/BPChain/private-xain/blob/dev/files/data_collection.py) which sends the runtime data of the chain to a server. 
3. [`scenario_slave`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/scripts/python_sources/implementation/slave.py)
which runs a websocket receiving transaction commands from the [`contract_deployer`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/scripts/python_sources/master_node/run_scenario_service.py)
4. [`scenario_execution_scripts`](https://github.com/BPChain/private-xain/tree/master/files/METAScenario/scripts) which implement the xain specific execution of a transaction. They are connected with the [`scenario_slave`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/scripts/python_sources/implementation/slave.py)
5. We are not allowed to upload the geth client to github. If you are interested in running the XAIN implementation, please contact us.


### contract_deployer_node files
1. [`data_collection`](https://github.com/BPChain/private-xain/blob/dev/files/data_collection.py) which sends the runtime data of the chain to a server.
2.  [`contract_migration`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/startMigration.js) which deploys the smart contract to run transaction with a specific payload. It also opens a websocket connection for retrieving the smart contract address, so the nodes are able to use the same smart contract instance.
3. [`master`](./python_sources/master) contains the main entry point to start the 
[`scenario-orchestration-service`](https://github.com/BPChain/scenario-orchestration-service) which 
listens for input from the [`private-chain-controller` ](https://github.com/BPChain/private-chain-controller)
at port 22000. 

### bootstrap files
1. [`Blockchain genesis file`](https://github.com/BPChain/private-xain/tree/master/files/blockchain_files) which includes the genesis.json to initialize the blockchain

### Docker Setup
Both slave and master share one dockerfile but are defined as different services with different 
entry points in the docker-compose file. You can simply scale slaves at any time. Masternodes 
should not be scaled. 
Run e.g. docker-compose up --build scale slavenode=15

