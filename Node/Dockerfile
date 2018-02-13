FROM debian:stable-slim

RUN apt update -y
RUN apt upgrade -y
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt install git bash python3 musl-dev gcc python3-dev python3-pip dnsutils nodejs curl -y

RUN npm install -g truffle
RUN pip3 install web3 websocket-client pyyaml

COPY keys root/keys
COPY files root/files
RUN chmod +x /root/files/geth
RUN chmod +x /root/files/start_eth_node.sh
RUN chmod +x /root/files/start_bootstrap.sh
RUN chmod +x /root/files/start_lazy_node.sh
