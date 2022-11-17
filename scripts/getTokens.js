const fs = require('fs')
const abi = require('../abi/bridgeAbi.json')
const hre = require('hardhat')
const tokenAbi = require('@openzeppelin/contracts/build/contracts/ERC20.json').abi


const address = '0x6f1D09Fed11115d65E1071CD2109eDb300D80A27'
const provider = new hre.ethers.providers.AlchemyProvider('homestead', process.env.MAINNET_API_KEY)
const bridgeContract = new hre.ethers.Contract(address, abi, provider)

const getTokensAssets = async () => {

    const tokens = []

    try {
        let getAllTokens = await bridgeContract.getBridgeTokenList()
        getAllTokens.forEach(token => {
            tokens.push(token)
        })
        return tokens
    } catch (err) {
        console.log(err)
    }
}

const getTokenDetails = async (token) => {
    try {
        const tokenContract = new hre.ethers.Contract(token.addr, tokenAbi, provider)
        const blockHeight = await provider.getBlock()
        const tokenBalance = await tokenContract.balanceOf(address)

        const tokenDetails = {
            addr: token.addr,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            balance: hre.ethers.utils.formatUnits(tokenBalance, token.decimals),
            timestamp: blockHeight.timestamp,
            block_height: blockHeight.number,
        }
        return tokenDetails
    } catch (err) {
        console.log(err)
    }
}

const automateProcess = async () => {

    let tokensInfo = []

    try {
        let tokens = await getTokensAssets()
        for (let i = 0; i < tokens.length; i++) {
            let result = await getTokenDetails(tokens[i])
            tokensInfo.push(result)
        }
    } catch (err) {
        console.log(err)
    }
    try {
        const path = './fx-bridge-token-supply.json'
        if (fs.existsSync(path)) {
            let data = JSON.parse(fs.readFileSync(path))
            data.push(tokensInfo)
            fs.writeFileSync('fx-bridge-token-supply.json', JSON.stringify(data))
            return
        }
        fs.writeFileSync('fx-bridge-token-supply.json', JSON.stringify([tokensInfo]))
    } catch (err) {
        console.log(err)
    }
}

async function main() {

    // optional counter for visual reference of timer.
    let counter = 0

    const timer = setInterval(() => {
        counter++
        console.log(counter)
    }, 1000)

    const executeAutomation = setInterval(automateProcess, 5000)

    setTimeout(() => {
        clearInterval(timer)
        clearInterval(executeAutomation)
    }, 60000)

    automateProcess()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})