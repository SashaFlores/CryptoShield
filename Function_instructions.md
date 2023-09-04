Activate keys:
npx env-enc set-pw

Write password: cryptoshield

Deploy consumer contract:
npx hardhat functions-deploy-client --verify false --network ethereumSepolia

Add the deployed constract to the subscription:
npx hardhat functions-sub-add --subid 387 --contract CONSUMER_ADDRESS --network ethereumSepolia

For running price predict fetching:
	1- Go to Functions-request-config.js and discomment "source: fs.readFileSync("./fetch-price-predict.js").toString()"
	2- Run this command: npx hardhat functions-request --network ethereumSepolia --contract CONSUMER_ADDRESS --subid 387 --gaslimit 300000
For running risk fetching:
	1- Go to Functions-request-config.js and discomment "source: fs.readFileSync("./fetch-risk.js").toString()"
	2- Run this command: npx hardhat functions-request --network ethereumSepolia --contract CONSUMER_ADDRESS --subid 387 --gaslimit 300000

Now you are able to call fetchPricePredict() and fetchRisk() from the consumer contract



private key 56a96454eebdb3db04ff9526eadd4841591cc72e47a556753a9dad4aaef54d14
etherscan api key QG5US1HJM499RDKBWQ4R4EYZKEJ3X86J8M
npx env-enc set-pw




    uint64 private constant c_subscriptionId = 387;
    uint32 private constant c_gasLimit = 300000;

CryptoShield at:  0x665435E7469528907a9d51FaE9219B173Ff6F621
https://sepolia.etherscan.io/address/0xe72322512eB1bc98843E89D3c81cECBddC9407de#code
keepers PAge: https://automation.chain.link/sepolia/29412326078011570174104507662748067625464013170565000060589610754636523736506


1- npx hardhat functions-deploy-crypto --network sepolia --verify true
2- npx hardhat functions-sub-add --subid 387 --contract 0x665435E7469528907a9d51FaE9219B173Ff6F621 --network sepolia
3- npx hardhat functions-request --network sepolia --contract 0x665435E7469528907a9d51FaE9219B173Ff6F621 --subid 387 --gaslimit 300000