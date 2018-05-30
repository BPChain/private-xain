
# private xain


Master-Branch: [![Build Status](https://travis-ci.org/BPChain/private-xain.svg?branch=master)](https://travis-ci.org/BPChain/private-xain) <br />
Dev-Branch: [![Build Status](https://travis-ci.org/BPChain/private-xain.svg?branch=dev)](https://travis-ci.org/BPChain/private-xain)  <br />

### Structure
Run Xain in docker. We have three different docker images. Eth_node for running a blockchain node. Eth_contract_deployer for running the scenario simulation and bootstrap for initializing the blockchain and interconnecting all eth_nodes.

### Project files
1. [`data_collection`](https://github.com/BPChain/private-xain/blob/dev/files/data_collection.py) which sends the runtime data of the chain to a server. 
2. [`implementation`](https://github.com/BPChain/private-xain/tree/dev/files/METAScenario/scripts/python_sources/implementation) which offers proxy implementations for the eth_nodes which allows the 
contract deployer to communicate with the eth_nodes. 
3. [`master`](./python_sources/master) contains the main entry point to start the 
[`scenario-orchestration-service`](https://github.com/BPChain/scenario-orchestration-service) which 
listens for input from the [`private-chain-controller` ](https://github.com/BPChain/private-chain-controller)
at port 22000. 
4. [`slave_node`](./python_sources/slave_node) which contains a python program running on the 
each slave. It connects to the `scenario-orchestration-service` running on the [`master`](
./python_sources/master) to send its credentials for multichain rpc login. 

### Docker Setup
Both slave and master share one dockerfile but are defined as different services with different 
entry points in the docker-compose file. You can simply scale slaves at any time. Masternodes 
should not be scaled. 
Run e.g. docker-compose up --build scale slavenode=15



##### Miscellaneous
This Multichain setup is not recommended for production. Anyone can control the nodes.

