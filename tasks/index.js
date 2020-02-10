require('module-alias/register')

const utils = require('@utils');
const ethers = require('ethers')
const provider = utils.provider

const emptyBytes = "0x0000000000000000000000000000000000000000000000000000000000000000"

const rinkebyResolver = "0x06E6B4E68b0B9B2617b35Eec811535050999282F"
const newrinkebyResolver = "0xdaaf96c344f63131acadd0ea35170e7892d3dfba"

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

const rinkebyENS = ENS_REGISTRY_ADDRESS
const abi = require("../build/contracts/ENS.json").abi
const ensContract = utils.getContract(rinkebyENS,abi)

const subdomainContract = utils.getDeployedContract('RapidSubdomainRegistrar')
const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)

const baseRegistrarAddress = "0x53CEb15b76023FBEC5Bb39450214926F6aA77d2e"
const brABI = require("../build/contracts/BaseRegistrar.json").abi
const baseRegistrarContract = utils.getContract(baseRegistrarAddress,brABI)


const base = "eth"
const domain = "one"
const subdomain = "fool"
const domainFull = domain + "." + base
const subdomainFull = subdomain + "." + domainFull


const main = async () => {
    console.log("Running Main Task...")

    await printInfo()
    //await configure()
    await transferOwnership()
    // let sig = await createAndSignCertificate()
    // await registerCertificate(sig)
    //await testRegistryFunctions()
    await register()
    await printInfo()


    console.log("Done")
}

const configure = async () => {
    const contract = subdomainContract.connect(deployAccount)

    console.log("configure...")

    let price = ethers.utils.parseEther(".01")
    let tx = await contract.configureDomainWithDelegates(domain, price, []);
    await tx.wait()

    console.log("configure done")
}

const transferOwnership = async () => {
    console.log("transferOwnership...")

    let domainHash = ethers.utils.namehash(domainFull)
    ec = ensContract.connect(deployAccount)
    let tx = await ec.setOwner(domainHash, subdomainContract.address)
    await tx.wait()

    //console.log(tx)
    console.log("transferOwnership done")
}

const testRegistryFunctions = async () => {
    console.log("testRegistryFunctions...")

    let domainHash = ethers.utils.namehash(domainFull)
    let subdomainHash = ethers.utils.namehash(subdomainFull)
    let subKeccak = ethers.utils.id(subdomain)


    ec = ensContract.connect(altAccount)
    // let tx = await ec.setOwner(domainHash, altAccount.address)
    // await tx.wait()

    // let tx2 = await ec.setSubnodeOwner(domainHash, subKeccak, altAccount.address)
    // await tx2.wait()

    let tx3 = await ec.setResolver(subdomainHash, altAccount.address)
    await tx3.wait()


    await printInfo()
    //console.log(tx)
    console.log("transferOwnership done")
}

const register = async () => {
    const contract = subdomainContract.connect(otherAccount)
    console.log("register...")

    let dk = ethers.utils.id(domain)
    let price = ethers.utils.parseEther(".01")
    let tx = await contract.register(dk, subdomain, utils.emptyAddress, newrinkebyResolver, {value: price})
    await tx.wait()
    console.log("register done")
}

const createAndSignCertificate = async () => {
    console.log("createAndSignCertificate...")
    let domainLabel = ethers.utils.id(domain)

    let certificateId = await subdomainContract.certificateId(domainLabel, otherAccount.address)
    console.log("CERT ID: " + certificateId)
    let cidBytes = ethers.utils.arrayify(certificateId)
    let signature = deployAccount.signMessage(cidBytes)
    console.log("createAndSignCertificate done")
    return signature
}

const registerCertificate = async (sig) => {
    console.log("registerCertificate...")
    const contract = subdomainContract.connect(otherAccount)
    let domainHash = ethers.utils.id(domain)

    let tx = await contract.registerCertificate(domainHash, subdomain, utils.emptyAddress, newrinkebyResolver, sig)
    await tx.wait()

    console.log("registerCertificate done")
}

const getControlBack = async () => {
    let domainNamehash = ethers.utils.namehash(domainFull)
    let hashDomain = ethers.utils.id(domain)

    let ensOwner = await ensContract.owner(domainNamehash);
    console.log("Domain Owner: "  + ensOwner)

    let sdc = new ethers.Contract(ensOwner, subdomainContract.interface.abi, deployAccount)
    let tx = await sdc.withdrawDomain(hashDomain)
    await tx.wait()
    let ensOwner2 = await ensContract.owner(domainNamehash);
    console.log("Domain Owner: "  + ensOwner2)

}

const test = async () => {

    let namehash = ethers.utils.namehash(subdomainFull)
    let eco = await ensContract.owner(namehash)
    console.log("ENS Contract Owner", eco)

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
    console.log("Record Exists: "  + record)
    let ensOwner = await ensContract.owner(domainNamehash);
    console.log("Domain Owner: "  + ensOwner)
    let ensSubOwner = await ensContract.owner(subdomainNamehash);
    console.log("Subdomain Owner: "  + ensSubOwner)
    let contractDomainOwner = await subdomainContract.owner(hashDomain);
    console.log("Contract Domain Owner: ", contractDomainOwner)
    let contractDomainInfo = await subdomainContract.domains(hashDomain);
    console.log("Contract Domain info: ", contractDomainInfo)
    console.log("***********************************************")
    let domainResolveAddress = await provider.resolveName(domainFull)
    let subdomainResolveAddress = await provider.resolveName(subdomainFull)
    console.log(domainFull + ":" + " " + domainResolveAddress)
    console.log(subdomainFull + ":" + " " + subdomainResolveAddress)
    console.log("*************| END INFO |************************")

}

main();