FROM debian:latest

RUN apt update -y
RUN apt upgrade -y
RUN apt install curl gnupg -y
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install nodejs -y
RUN apt install git bash python3 musl-dev gcc python3-dev python3-pip dnsutils -y
RUN pip3 install git+https://github.com/BPChain/scenario-orchestration-service.git
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY keys root/keys
COPY files root/files
RUN chmod +x /root/files/geth
RUN chmod +x /root/files/start_xain_node.sh
RUN chmod +x /root/files/start_bootstrap.sh
RUN chmod +x /root/files/start_contract_deployer_node.sh
RUN cd /root/files && npm install
