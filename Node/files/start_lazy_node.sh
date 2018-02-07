#!bin/bash
cd /root/files || exit
./geth --datadir=~/data init "/root/files/blockchain_files/genesis.json"
BOOTSTRAP_IP=`getent hosts bootstrap | cut -d" " -f1`
GETH_OPTS=${@/IPAddress/$BOOTSTRAP_IP}
./geth $GETH_OPTS
