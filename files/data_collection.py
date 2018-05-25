import sys
from time import sleep

import yaml
from statistics_reader.blockchain_reader import BlockchainReader
from statistics_reader.sender import Sender

from .xain_adapter import XainAdapter


def main():
    is_miner = sys.argv[1] if len(sys.argv) > 1 else '1'
    print(is_miner)
    uri = yaml.safe_load(open("/root/files/config.yml"))
    server_address = uri['networking']['socketProtocol'] + uri['networking']['socketAddress']
    blockchain_reader = BlockchainReader('geth', 'xain', XainAdapter(is_miner))
    Sender(server_address, 15, blockchain_reader)


if __name__ == '__main__':
    sleep(20)
    main()
