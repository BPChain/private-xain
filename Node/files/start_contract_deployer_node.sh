#!/bin/bash
echo "141.89.225.55 bpt-lab.org" >> /etc/hosts
mkdir /root/data
mkdir /root/data/keystore
cp /root/keys/coinbasepwd_$XAIN_NUMBER /root/data
mv /root/data/coinbasepwd_$XAIN_NUMBER /root/data/coinbasepwd
cp /root/data/coinbasepwd /root/files
cp /root/keys/XAIN_key_$XAIN_NUMBER /root/data/keystore
cd /root/files || exit
./geth --datadir=~/data init "/root/files/blockchain_files/genesis.json"
XAIN_BOOTSTRAP_IP=`getent hosts xain_bootstrap | cut -d" " -f1`
GETH_OPTS=${@/IPAddress/$XAIN_BOOTSTRAP_IP}
python3 /root/files/node.py &
./geth $GETH_OPTS &
cd /root/files/METAScenario;node startMigration.js &
cd /root/files;node chain_configuration.js

