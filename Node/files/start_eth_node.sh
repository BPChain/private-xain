#!/bin/bash
cd /root/files
./geth --datadir=~/data init "/root/files/blockchain_files/genesis.json"
./geth --datadir=~/data --password <(echo -n 123)  account new
BOOTSTRAP_IP=`getent hosts bootstrap | cut -d" " -f1`
GETH_OPTS=${@/IPAddress/$BOOTSTRAP_IP}
python3 /root/files/node.py &
./geth $GETH_OPTS



