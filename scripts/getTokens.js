const fs = require('fs')
const abi = require('../abi/bridgeAbi.json')
const hre = require('hardhat')
const tokenAbi = require('@openzeppelin/contracts/build/contracts/ERC20.json').abi

async function main() {
    const address = '0x6f1D09Fed11115d65E1071CD2109eDb300D80A27'
    const provider = new hre.ethers.providers.AlchemyProvider('homestead', process.env.MAINNET_API_KEY)
    const bridgeContract = new hre.ethers.Contract(address, abi, provider)

    try {
        let getAllTokens = await bridgeContract.getBridgeTokenList()

        getAllTokens.forEach(async token => {
            const tokenAddress = token.addr
            const tokenContract = new hre.ethers.Contract(tokenAddress, tokenAbi, provider)
            let tokenBalance = await tokenContract.balanceOf(address)

            const tokenDetails = {
                addr: token.addr,
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals,
                balance: hre.ethers.utils.formatUnits(tokenBalance, token.decimals),
                timestamp: Date.now(),
            }
            console.log(tokenDetails)
        })
    } catch (err) {
        console.log(err)
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
