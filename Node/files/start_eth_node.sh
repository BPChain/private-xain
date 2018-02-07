#!/bin/bash
echo (nslookup bpt-lab.org | awk -F’: ' ‘NR==6 { print $2 }’) “bpt-lab.org”
mkdir /root/data
mkdir /root/data/keystore
cp /root/keys/coinbasepwd_$XAIN_NUMBER /root/data
mv /root/data/coinbasepwd_$XAIN_NUMBER /root/data/coinbasepwd
cp /root/keys/XAIN_key_$XAIN_NUMBER /root/data/keystore
cd /root/files || exit
./geth --datadir=~/data init "/root/files/blockchain_files/genesis.json"
BOOTSTRAP_IP=`getent hosts bootstrap | cut -d" " -f1`
GETH_OPTS=${@/IPAddress/$BOOTSTRAP_IP}
python3 /root/files/node.py &
./geth $GETH_OPTS
