require('module-alias/register')

const utils = require('@utils');
const ethers = require('ethers')
const provider = utils.provider

const emptyBytes = "0x0000000000000000000000000000000000000000000000000000000000000000"

const rinkebyResolver = "0x06E6B4E68b0B9B2617b35Eec811535050999282F"

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

// const rinkebyENS = ENS_REGISTRY_ADDRESS
const abi = require("../build/contracts/ENS.json").abi
// const ensContract = utils.getContract(rinkebyENS,abi)
const ensContract = utils.getDeployedContract('ENSRegistry')

const subdomainContract = utils.getDeployedContract('RapidSubdomainRegistrar')
const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const contract = subdomainContract.connect(deployAccount)


const base = "eth"
const domain = "ball"
const subdomain = "a"
const domainFull = domain + "." + base
const subdomainFull = subdomain + "." + domainFull
let baseHash = ethers.utils.id(base)
let baseHashNameHash = ethers.utils.namehash(base)



const main = async () => {
    console.log("Running ens test...")


    await registrySetup()
    await getDomain()
    await printInfo()


}

const registrySetup = async () => {

    let ownENSRegistry = ensContract.connect(deployAccount)
    await ownENSRegistry.setSubnodeOwner(emptyBytes, baseHash, deployAccount.address)
}

const getDomain = async () => {
    let hashDomain = ethers.utils.id(domain)
    let ownENSRegistry = ensContract.connect(deployAccount)
    await ownENSRegistry.setSubnodeOwner(baseHashNameHash, hashDomain, deployAccount.address)

}

const printInfo = async () => {
    let hashDomain = ethers.utils.id(domain)
    let domainNamehash = ethers.utils.namehash(domainFull)
    let subdomainNamehash = ethers.utils.namehash(subdomainFull)
    let subKeccak = ethers.utils.id(subdomain)

    console.log("*************| INFO |**************************")
    console.log("baseHash:", baseHash)
    console.log("baseHashNameHash label hash:", baseHashNameHash)    
    console.log("Domain:", domain)
    console.log("Domain label hash:", hashDomain)
    console.log("Domain namehash:", domainNamehash)
    console.log("Subdomain namehash:", subdomainNamehash)
    console.log("subdomain keccak: " + subKeccak)
    console.log("***********************************************")
    let ethOwner = await ensContract.owner(baseHashNameHash);
    console.log("ETH subdomain Owner: "  + ethOwner)
    let record = await ensContract.recordExists(domainNamehash);
    console.log("Record Exists: "  + record)
    let ensOwner = await ensContract.owner(domainNamehash);
    console.log("Domain Owner: "  + ensOwner)
    let ensSubOwner = await ensContract.owner(subdomainNamehash);
    console.log("Subdomain Owner: "  + ensSubOwner)
    let contractDomainInfo = await contract.domains(hashDomain);
    console.log("Contract Domain info: ", contractDomainInfo)
    // console.log("***********************************************")
    // let domainResolveAddress = await provider.resolveName(domainFull)
    // let subdomainResolveAddress = await provider.resolveName(subdomainFull)
    // console.log(domainFull + ":" + " " + domainResolveAddress)
    // console.log(subdomainFull + ":" + " " + subdomainResolveAddress)
    console.log("*************| END INFO |************************")

}


main()