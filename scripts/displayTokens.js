const fs = require('fs')

async function main() {

    const path = './fx-bridge-token-supply.json'
    if (!fs.existsSync(path)) {
        console.error('File is missing or does not exist.')
        return
    }
    const retrieveData = JSON.parse(fs.readFileSync(path))
    const flattened = [].concat(...retrieveData)
    console.table(flattened)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})