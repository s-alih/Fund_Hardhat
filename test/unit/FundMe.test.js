const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
describe("FundMe", () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
    })

    describe("constructor", async () => {
        it("sets aggregator address correctly", async () => {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async () => {
        it("fails when not enough eth is send", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })

        it("updated amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("should update funder array", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    })

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from single funder", async () => {
            // arrange
            const startingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // act
            const transactionResponse = await fundMe.withdraw()
            const transactionRecipt = await transactionResponse.wait(1)
            let { gasUsed, effectiveGasPrice } = transactionRecipt

            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endignDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // assert
            assert.equal(endingFundBalance.toString(), 0)

            assert.equal(
                startingDeployerBalance.add(startingFundBalance).toString(),
                endignDeployerBalance.add(gasCost).toString()
            )
        })

        it("withdraw ETH from multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 1; i++) {
                const fundMeconnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeconnectedContract.fund({ value: sendValue })
            }
            // arrange
            const startingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // act
            const transactionResponse = await fundMe.withdraw()
            const transactionRecipt = await transactionResponse.wait(1)
            let { gasUsed, effectiveGasPrice } = transactionRecipt

            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endignDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // assert
            assert.equal(endingFundBalance.toString(), 0)

            assert.equal(
                startingDeployerBalance.add(startingFundBalance).toString(),
                endignDeployerBalance.add(gasCost).toString()
            )

            await expect(fundMe.getFunder(0)).to.be.reverted
            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("only owner will withdraw the fund", async () => {
            const attackers = await ethers.getSigners()
            const fundMeconnectedContract = await fundMe.connect(attackers[1])
            await expect(fundMeconnectedContract.withdraw()).to.be.reverted
        })

        it("cheaper withdraw ETH from multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 1; i++) {
                const fundMeconnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeconnectedContract.fund({ value: sendValue })
            }
            // arrange
            const startingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionRecipt = await transactionResponse.wait(1)
            let { gasUsed, effectiveGasPrice } = transactionRecipt

            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endignDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // assert
            assert.equal(endingFundBalance.toString(), 0)

            assert.equal(
                startingDeployerBalance.add(startingFundBalance).toString(),
                endignDeployerBalance.add(gasCost).toString()
            )

            await expect(fundMe.getFunder(0)).to.be.reverted
            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("cheaper withdraw ETH from single funder", async () => {
            // arrange
            const startingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionRecipt = await transactionResponse.wait(1)
            let { gasUsed, effectiveGasPrice } = transactionRecipt

            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endignDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            // assert
            assert.equal(endingFundBalance.toString(), 0)

            assert.equal(
                startingDeployerBalance.add(startingFundBalance).toString(),
                endignDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
