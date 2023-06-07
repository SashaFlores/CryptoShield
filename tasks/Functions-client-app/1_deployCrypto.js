const { types } = require("hardhat/config")
const { VERIFICATION_BLOCK_CONFIRMATIONS, networkConfig } = require("../../network-config")

task("functions-deploy-crypto", "Deploys the CryptoShield contract")
  .addOptionalParam("verify", "Set to true to verify client contract", false, types.boolean)
  .setAction(async (taskArgs) => {
    if (network.name === "hardhat") {
      throw Error("This command cannot be used on a local hardhat chain.")
    }

    console.log(`Deploying CryptoShield Contract to ${network.name}`)

    const oracleAddress = networkConfig[network.name]["functionsOracleProxy"]
    const accounts = await ethers.getSigners()

    // Deploy CryptoShield
    const clientContractFactory = await ethers.getContractFactory("CryptoShield")
    const clientContract = await clientContractFactory.deploy(oracleAddress)

    console.log(
      `\nWaiting ${VERIFICATION_BLOCK_CONFIRMATIONS} blocks for transaction ${clientContract.deployTransaction.hash} to be confirmed...`
    )
    await clientContract.deployTransaction.wait(VERIFICATION_BLOCK_CONFIRMATIONS)

    // Verify the CryptoShield Contract
    const verifyContract = taskArgs.verify

    if (verifyContract && (process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY)) {
      try {
        console.log("\nVerifying contract...")
        await clientContract.deployTransaction.wait(Math.max(6 - VERIFICATION_BLOCK_CONFIRMATIONS, 0))
        await run("verify:verify", {
          address: clientContract.address,
          constructorArguments: [oracleAddress, stcAddress],
        })
        console.log("RecordLabel verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log("Error verifying contract.  Try delete the ./build folder and try again.")
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract) {
      console.log("\nPOLYGONSCAN_API_KEY or ETHERSCAN_API_KEY missing. Skipping contract verification...")
    }

    console.log(`\nCryptoShield contract deployed to ${clientContract.address} on ${network.name}`)
  })
