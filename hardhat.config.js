require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    mainnet: {
      url: process.env.GOERLI_URL,
      accounts:
        [process.env.PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    token: 'ETH'
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}
