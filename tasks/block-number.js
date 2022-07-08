const { tasks } = require("hardhat/config")

task("block-number", "Get the current block number").setAction(
    async (taskArgs, hre) => {
        const blocknumber = await hre.ethers.provider.getBlockNumber()
        console.log(`current block number is: ${blocknumber}`)
    }
)

module.exports = {}
