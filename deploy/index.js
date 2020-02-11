require('module-alias/register')

const utils = require("@utils/index.js");
const ethers = require("ethers")
let deployAccount = utils.ethersAccount(0)

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

const main = async () => {
    console.log("Deployment not configured yet!")
    await deployRinkeby()
}

const deployRinkeby = async () => {

    const metaProxy = await utils.deployContractAndWriteToFile('MetaProxy', deployAccount, [])
    console.log("Meta Proxy deployed at address: " + metaProxy.address)

    let rinkebyENS = ENS_REGISTRY_ADDRESS
    let constructorParams = [rinkebyENS,metaProxy.address]
    const exampleContract = await utils.deployContractAndWriteToFile('RapidSubdomainRegistrarMeta', deployAccount, constructorParams)
    console.log("Contract deployed at address: " + exampleContract.address)
}

const deployLocal = async () => {
    const metaProxy = await utils.deployContractAndWriteToFile('MetaProxy', deployAccount, [])
    console.log("Meta Proxy deployed at address: " + metaProxy.address)

    const mockRegistry = await utils.deployContractAndWriteToFile('ENSRegistry', deployAccount, [])
    console.log("Mock Registry deployed at address: " + mockRegistry.address)

    let constructorParams = [mockRegistry.address, metaProxy.address]
    const subdomainReg = await utils.deployContractAndWriteToFile('RapidSubdomainRegistrarMeta', deployAccount, constructorParams)
    console.log("Subdomain Meta Contract deployed at address: " + subdomainReg.address)


    const subdomainReg1 = await utils.deployContractAndWriteToFile('RapidSubdomainRegistrar', deployAccount, [mockRegistry.address])
    console.log("Subdomain Contract deployed at address: " + subdomainReg1.address)
}


main();