
# private xain


Master-Branch: [![Build Status](https://travis-ci.org/BPChain/private-xain.svg?branch=master)](https://travis-ci.org/BPChain/private-xain) <br />
Dev-Branch: [![Build Status](https://travis-ci.org/BPChain/private-xain.svg?branch=dev)](https://travis-ci.org/BPChain/private-xain)  <br />

### Structure
Run Xain in docker. We have three different docker images. xain_node for running a blockchain node. xain_contract_deployer for running the scenario simulation and xain_bootstrap for initializing the blockchain and interconnecting all xain_nodes.

### xain_node files
1. ['blockchain_accounts'](https://github.com/BPChain/private-xain/tree/master/keys) are required for each blockchain node to start mining and participate in smart contracts. The XAIN implementation requires specific accounts which cannot be created by geth automatically. Therefore these accounts are fixed for each blockchain node.
2. [`data_collection`](https://github.com/BPChain/private-xain/blob/dev/files/data_collection.py) which sends the runtime data of the chain to a server. 
3. [`scenario_slave`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/scripts/python_sources/implementation/slave.py)
which runs a websocket receiving transaction commands from the [`contract_deployer`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/scripts/python_sources/master_node/run_scenario_service.py)
4. [`scenario_execution_scripts`](https://github.com/BPChain/private-xain/tree/master/files/METAScenario/scripts) which implement the xain specific execution of a transaction. They are connected with the [`scenario_slave`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/scripts/python_sources/implementation/slave.py)
5. We are not allowed to upload the geth client to github. If you are interested in running the XAIN implementation, please contact us.


### xain_contract_deployer files
1. [`data_collection`](https://github.com/BPChain/private-xain/blob/dev/files/data_collection.py) which sends the runtime data of the chain to a server.
2.  [`contract_migration`](https://github.com/BPChain/private-xain/blob/master/files/METAScenario/startMigration.js) which deploys the smart contract to run transaction with a specific payload. It also opens a websocket connection for retrieving the smart contract address, so the nodes are able to use the same smart contract instance.
3. [`master`](./python_sources/master) contains the main entry point to start the 
[`scenario-orchestration-service`](https://github.com/BPChain/scenario-orchestration-service) which 
listens for input from the [`private-chain-controller` ](https://github.com/BPChain/private-chain-controller)
at port 22000. 

### xain_bootstrap files
1. [`Blockchain genesis file`](https://github.com/BPChain/private-xain/tree/master/files/blockchain_files) which includes the genesis.json to initialize the blockchain

### Docker Setup
All nodes use the same Dockerfile but have different entrypoints defined in the [`docker-compose.yml`](https://github.com/BPChain/private-xain/blob/dev/docker-compose.yml).
To run the blockchain just start it by running docker-compose up. Please note that scaling is allowed only on the xain_node.

