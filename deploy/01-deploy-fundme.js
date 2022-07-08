const { networkconfig, devchain } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethusdpricefeedaddress
    if (devchain.includes(network.name)) {
        const ethusdAggregator = await deployments.get("MockV3Aggregator")
        ethusdpricefeedaddress = ethusdAggregator.address
    } else {
        ethusdpricefeedaddress = networkconfig[chainId]["ethusdpricefeed"]
    }

    const args = [ethusdpricefeedaddress]
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockconfirmations || 1,
    })
    if (!devchain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(FundMe.address, args)
    }
    log("_____________________________________________________________________")
}

module.exports.tags = ["all", "fundme"]
