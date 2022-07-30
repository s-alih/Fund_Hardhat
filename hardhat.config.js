require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports = {
    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
    },
}
