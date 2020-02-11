require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider

const emptyBytes = "0x0000000000000000000000000000000000000000000000000000000000000000"

const newrinkebyResolver = "0xdaaf96c344f63131acadd0ea35170e7892d3dfba"

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

const rinkebyENS = ENS_REGISTRY_ADDRESS
const abi = require("../build/contracts/ENS.json").abi
const ensContract = utils.getContract(rinkebyENS, abi)
//const ensContract = utils.getDeployedContract('ENSRegistry')

const subdomainContract = utils.getDeployedContract('RapidSubdomainRegistrarMeta')
const metaProxyContract = utils.getDeployedContract('MetaProxy')

const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)
const certAccount = utils.ethersAccount(3)

const base = "eth"
const domain = "rapid"
const subdomain = "joe"
const domainFull = domain + "." + base
const subdomainFull = subdomain + "." + domainFull


const main = async () => {
    console.log("Running Main Task...")

    console.log("Subdomain Contract address: " + subdomainContract.address)
    console.log("Metaproxy Contract address: " + metaProxyContract.address)

    await printInfo()

    await configure()
    await transferOwnership()

    await printInfo()


    console.log("Done")
}

const configure = async () => {
    const contract = subdomainContract.connect(deployAccount)

    console.log("configure...")

    let price = ethers.utils.parseEther(".01")
    let kamesDelegate = "0x704f0369d4a4C338e0b87D7CF160187D0e434Df2"
    let tx = await contract.configureDomainWithDelegates(domain, price, [kamesDelegate]);
    await tx.wait()

    console.log("configure done")
}

const transferOwnership = async () => {
    console.log("transferOwnership...")
    ec = ensContract.connect(deployAccount)
    let tx = await ec.setApprovalForAll(subdomainContract.address, true)
    await tx.wait()
    console.log("transferOwnership done")
}


const printInfo = async () => {
    let hashDomain = ethers.utils.id(domain)
    let domainNamehash = ethers.utils.namehash(domainFull)
    let subdomainNamehash = ethers.utils.namehash(subdomainFull)
    let subKeccak = ethers.utils.id(subdomain)

    console.log("*************| INFO |**************************")
    console.log("Domain:", domain)
    console.log("Domain label hash:", hashDomain)
    console.log("Domain namehash:", domainNamehash)
    console.log("Subdomain namehash:", subdomainNamehash)
    console.log("subdomain keccak: " + subKeccak)
    console.log("***********************************************")
    let record = await ensContract.recordExists(domainNamehash);
    console.log("Record Exists: " + record)
    let ensOwner = await ensContract.owner(domainNamehash);
    console.log("Domain Owner: " + ensOwner)
    let ensSubOwner = await ensContract.owner(subdomainNamehash);
    console.log("Subdomain Owner: " + ensSubOwner)
    let contractDomainInfo = await subdomainContract.domains(hashDomain);
    console.log("Contract Domain info: ", contractDomainInfo)
    console.log("***********************************************")
    // let domainResolveAddress = await provider.resolveName(domainFull)
    // let subdomainResolveAddress = await provider.resolveName(subdomainFull)
    // console.log(domainFull + ":" + " " + domainResolveAddress)
    // console.log(subdomainFull + ":" + " " + subdomainResolveAddress)
    console.log("*************| END INFO |************************")

}

main();