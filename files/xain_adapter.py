from time import sleep

from statistics_reader.block import Block
from statistics_reader.blockchain_adapter import BlockchainAdapter
from web3 import Web3, HTTPProvider


class XainAdapter(BlockchainAdapter):

    def __init__(self, is_miner):
        super().__init__(is_miner)
        self.web3_rpc = Web3(HTTPProvider('http://127.0.0.1:8545', request_kwargs={'timeout': 120}))
        file = open("/root/files/coinbasepwd")
        coinbasepwd = file.read()
        while not self.web3_rpc.isConnected():
            sleep(1)
        self.web3_rpc.personal.unlockAccount(self.web3_rpc.eth.accounts[0], coinbasepwd, 0)
        self.web3_rpc.miner.start(1)

    def fetch_newest_block_number(self) -> int:
        return self.web3_rpc.eth.getBlock('latest').number

    def fetch_block_with(self, number: int):
        return self.web3_rpc.eth.getBlock(number)

    def make_block_from(self, raw_block) -> Block:
        #  TODO: Check the matter of the genesis block with potential timestamp 0
        return Block(raw_block.difficulty, raw_block.transactions,
                     raw_block.timestamp, raw_block.size)

    def hashrate(self) -> int:
        return self.web3_rpc.eth.hashrate

    def is_mining(self) -> int:
        if self.is_miner == '0':
            return 0
        return 1 if self.web3_rpc.eth.mining else 0

    def host_id(self):
        return self.web3_rpc.admin.nodeInfo.id

