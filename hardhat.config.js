require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-solhint')
require('solidity-coverage')
require("hardhat-gas-reporter")
require('hardhat-contract-sizer')
require('solidity-coverage')
require('@nomiclabs/hardhat-solhint')

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337
    },
    localDev: {
      url: `HTTP://127.0.0.1:8545`,
      chainId: 1337,
      saveDeployments: true,
      tags: ['local', 'test']
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 1,
      accounts: [],
      blockConfirmations: 5,
      timeout: 600000,
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/`, //needs edit
      chainId: 137,
      accounts: [],
      blockConfirmations: 5,
      timeout: 600000,
    },
    binance: {
      url: `https://bsc-dataseed.binance.org/`,
      chainId: 56,
      accounts: [],
      blockConfirmations: 5,
      timeout: 600000,
    },
    goerli: { 
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 5,
      accounts: [],
      blockConfirmations: 5,
      timeout: 600000,
      saveDeployments: true,
      live: true,
      tags: ['staging']
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: [
        // `0x${process.env.ADMIN_KEY}`, 
        // `0x${process.env.UPGRADER_KEY}`, 
        // `0x${process.env.OTHER_KEY}`, 
        // `0x${process.env.MINTER_KEY}`,
        // //`0x${process.env.OWNER_KEY}`,
        // `0x${process.env.MANAGER_KEY}`,
      ],
      blockConfirmations: 5,
      timeout: 600000,
      saveDeployments: true,
      live: true,
      tags: ['staging', 'backToBack']
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/`,
      chainId: 80001,
      accounts: [],
      blockConfirmations: 5,
      timeout: 600000,
    },
    bnbTest: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      chainId: 97,
      blockConfirmations: 5,
      timeout: 600000,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      sepolia: process.env.ADMIN
    },
    manager1: {
      default: 1,
      sepolia: process.env.MANAGER1
    },
    manager2: {
      default: 2,
      sepolia: process.env.MANAGER2
    },
    mocker: {
      default: 3,
    }
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP,
    outputFile: "gasReporter.txt",
    noColors: false,
    currency: "USD", 
  },
  solidity: {
    version: '0.8.10',
    settings: {
      optimizer: {
        enabled: true,
        runs: 500,
      }
    }
  },
  mocha: {
    timeout: 100000.
  },
  paths: {
    sources: "./contracts",
    scripts: "./scripts",
    tests: "./test",
    artifacts: "./artifacts",
    cache: "./cache",
    slither: "./slither"
  },
  etherscan: {
    apiKey: {
      // mainnet: process.env.ETHER_API,
      polygon: process.env.POLYGON_API,
      // binance: process.env.BNB_API,
      sepolia: process.env.SEPOLIA_API,
      // goerli: process.env.ETHER_API,
      mumbai: process.env.POLYGON_API,
      // bnbTest:  process.env.BNB_API,
    },
  },
};