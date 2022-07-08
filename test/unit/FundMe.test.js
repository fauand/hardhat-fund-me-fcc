const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!devchain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let MockV3Aggregator
          const sendvalue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("Constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.priceFeed()
                  assert.equal(response, MockV3Aggregator.address)
              })
          })
          describe("fund", async function () {
              it("Fails if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })
              it("Update the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendvalue })
                  const response = await fundMe.addressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendvalue.toString())
              })
              it("Add funders to funders array", async function () {
                  await fundMe.fund({ value: sendvalue })
                  const funder = await fundMe.funders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendvalue })
              })
              it("Witdraw ETH from a single founder", async function () {
                  const StartDeployerbalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  const StartFundMebalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const transactionresponse = await fundMe.withdraw()
                  const transactionreceipt = await transactionresponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionreceipt
                  const gascost = gasUsed.mul(effectiveGasPrice)
                  const EndDeployerbalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  const EndFundMebalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  assert.equal(EndFundMebalance.toString(), 0)
                  assert.equal(
                      StartDeployerbalance.add(StartFundMebalance).toString(),
                      EndDeployerbalance.add(gascost).toString()
                  )
              })
              it("allows us to withdraw with multiple funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundmeconnectedcontract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundmeconnectedcontract.fund({ value: sendvalue })
                  }
                  const StartDeployerbalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  const StartFundMebalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const transactionresponse = await fundMe.withdraw()
                  const transactionreceipt = await transactionresponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionreceipt
                  const gascost = gasUsed.mul(effectiveGasPrice)
                  const EndDeployerbalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  const EndFundMebalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  assert.equal(EndFundMebalance.toString(), 0)
                  assert.equal(
                      StartDeployerbalance.add(StartFundMebalance).toString(),
                      EndDeployerbalance.add(gascost).toString()
                  )
                  await expect(fundMe.funders(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerconnectedcontract = fundMe.connect(attacker)
                  await expect(
                      attackerconnectedcontract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
              })
          })
      })
