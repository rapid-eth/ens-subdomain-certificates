require('module-alias/register')

const utils = require("@utils/index.js");
const ethers = require("ethers")
let deployAccount = utils.ethersAccount(0)

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

const main = async () => {
    console.log("Deployment not configured yet!")
    await deployExample()
}

const deployExample = async () => {
    let rinkebyENS = ENS_REGISTRY_ADDRESS
    let constructorParams = [rinkebyENS]
    const exampleContract = await utils.deployContractAndWriteToFile('RapidSubdomainRegistrar', deployAccount, constructorParams)
    console.log("Contract deployed at address: " + exampleContract.address)

}


main();