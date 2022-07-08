const { network } = require("hardhat")
const {
    devchain,
    DECIMALS,
    INITIALANSWER,
} = require("../helper-hardhat-config.js")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (devchain.includes(network.name)) {
        log("Local network detected! Deploying mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIALANSWER],
        })
        log("Deployed!")
        log(
            "--------------------------------------------------------------------------------------------"
        )
    }
}

module.exports.tags = ["all", "mocks"]
