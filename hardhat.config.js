require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    networks: {
        goeril: {
            url: GOERIL_RPC_URL,
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
