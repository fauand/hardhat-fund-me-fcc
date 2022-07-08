require("@nomiclabs/hardhat-waffle")
require("dotenv").config()
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const Rinkeby_RPCurl = process.env.Rinkeby_RPCurl || "https://rinkeby.eth"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "key"
const COINMARKETCAP_API = process.env.COINMARKETCAP_API || "key"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"

module.exports = {
    solidity: { compilers: [{ version: "0.8.8" }, { version: "0.6.6" }] },
    defaultNetwork: "hardhat",
    networks: {
        rinkeby: {
            url: Rinkeby_RPCurl,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockconfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        // coinmarketcap: COINMARKETCAP_API,
        token: "AVAX",
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
