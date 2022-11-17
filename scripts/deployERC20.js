const hre = require('hardhat')
const fs = require('fs')

async function main() {

    //Deploying smart contract
    const HowardTokensContract = await hre.ethers.getContractFactory('HowardTokens')
    const HowardTokens = await HowardTokensContract.deploy()

    await HowardTokens.deployed()
    fs.appendFileSync('.env', `\nHOWARD_TOKENS=${HowardTokens.address}`)
    console.log('Howard Tokens deployed to:', HowardTokens.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})