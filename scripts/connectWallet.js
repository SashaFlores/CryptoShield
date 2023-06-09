const { ethers } = require("ethers")

async function main() {
  // Connect to MetaMask
  await window.ethereum.enable()
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  // Use the signer to interact with the Ethereum network
  const balance = await signer.getBalance()
  console.log("Account balance:", ethers.utils.formatEther(balance))

  // Initialize the document objects (only if running in a browser)
  if (typeof document !== "undefined") {
    const sendETH = document.querySelector("#sendETH")
    const addressTo = document.querySelector("#addressTo")
    const ETHAmount = document.querySelector("#ETHAmount")

    sendETH.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get the form values
      const addressToValue = addressTo.value
      const ETHAmountValue = ETHAmount.value
      // Calculate amount to transfer in wei
      const weiAmountValue = ethers.utils.parseEther(ETHAmountValue)

      // Form the transaction request for sending ETH
      const transactionRequest = {
        to: addressToValue.toString(),
        value: weiAmountValue,
      }

      // Send the transaction and log the receipt
      const receipt = await signer.sendTransaction(transactionRequest)
      console.log(receipt)
    })
  }
}

main()
  .then(() => {
    console.log("\nConnected Successfully :)")
    process.exitCode = 0
  })
  .catch((error) => {
    console.log("\nFailed Connection :(")
    console.error(error)
    process.exitCode = 1
  })
