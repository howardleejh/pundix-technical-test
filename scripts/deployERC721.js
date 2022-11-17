const hre = require('hardhat')
const fs = require('fs')

async function main() {

    //Deploying smart contract
    const HowardNftContract = await hre.ethers.getContractFactory('HowardNFT')
    const HowardNFT = await HowardNftContract.deploy()

    await HowardNFT.deployed()
    fs.appendFileSync('.env', `\nHOWARD_NFT=${HowardNFT.address}`)
    console.log('Howard NFTs deployed to:', HowardNFT.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})