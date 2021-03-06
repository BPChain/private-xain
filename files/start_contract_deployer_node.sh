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
cd ..
python3 -m files.data_collection 0 &
cd files
./geth $GETH_OPTS &
cd /root/files/METAScenario;node startMigration.js &
cd /root/files/METAScenario/scripts
python3 -m python_sources.master_node.run_scenario_service


