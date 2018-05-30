#!/bin/bash
cd /root/files
./geth --datadir=~/data init "/root/files/blockchain_files/genesis.json"
XAIN_BOOTSTRAP_IP=`getent hosts xain_bootstrap | cut -d" " -f1`
GETH_OPTS=${@/IPAddress/$XAIN_BOOTSTRAP_IP}
./geth $GETH_OPTS


