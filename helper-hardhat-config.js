const networkconfig = {
    4: {
        name: "rinkeby",
        ethusdpricefeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    31337: {
        name: "localhost",
    },
}

const devchain = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIALANSWER = 200000000000
module.exports = {
    networkconfig,
    devchain,
    DECIMALS,
    INITIALANSWER,
}
