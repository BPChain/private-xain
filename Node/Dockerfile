FROM ubuntu

RUN apt update -y
RUN apt upgrade -y
RUN apt install git bash python3 musl-dev gcc python3-dev python3-pip -y
RUN pip3 install web3 websocket-client pyyaml

COPY keys root/keys
COPY files root/files
COPY data root/data
RUN chmod +x /root/files/geth
RUN chmod +x /root/files/start_eth_node.sh
RUN chmod +x /root/files/start_bootstrap.sh
