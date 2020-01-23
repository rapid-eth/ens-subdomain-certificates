require('module-alias/register')

const utils = require("@utils/index.js");
const ethers = require("ethers")
let deployAccount = utils.ethersAccount(0)

const main = async () => {
    console.log("Deployment not configured yet!")
    await deployExample()
}

const deployExample = async () => {
    let rinkebyENS = "0xe7410170f87102DF0055eB195163A03B7F2Bff4A"
    let constructorParams = [rinkebyENS]
    const exampleContract = await utils.deployContractAndWriteToFile('RapidSubdomainRegistrar', deployAccount, constructorParams)
    console.log("Contract deployed at address: " + exampleContract.address)

}


main();