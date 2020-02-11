require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider

const emptyBytes = "0x0000000000000000000000000000000000000000000000000000000000000000"

// const rinkebyResolver = "0x06E6B4E68b0B9B2617b35Eec811535050999282F"
const newrinkebyResolver = "0xdaaf96c344f63131acadd0ea35170e7892d3dfba"

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

const rinkebyENS = ENS_REGISTRY_ADDRESS
const abi = require("../build/contracts/ENS.json").abi
const ensContract = utils.getContract(rinkebyENS,abi)
//const ensContract = utils.getDeployedContract('ENSRegistry')

const subdomainContract = utils.getDeployedContract('RapidSubdomainRegistrarMeta')
const metaProxyContract = utils.getDeployedContract('MetaProxy')

const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)
const certAccount = utils.ethersAccount(3)

const baseRegistrarAddress = "0x53CEb15b76023FBEC5Bb39450214926F6aA77d2e"
const brABI = require("../build/contracts/BaseRegistrar.json").abi
const baseRegistrarContract = utils.getContract(baseRegistrarAddress,brABI)


const base = "eth"
const domain = "ten"
const subdomain = "threeee"
const domainFull = domain + "." + base
const subdomainFull = subdomain + "." + domainFull


const main = async () => {
    console.log("Running Main Task...")

    console.log("Subdomain Contract address: "+ subdomainContract.address)
    console.log("Metaproxy Contract address: "+ metaProxyContract.address)

    await printInfo()
    // process.exit()
//     await configure()
//    await transferOwnership()

    let sig = await createAndSignCertificate()
    let mtx = await createMetaTx(sig)
    console.log(mtx)
    // await runMeta(mtx)
    // await registerCertificate(sig)

    // await register()

    // await getControlBack()

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
    ec = ensContract.connect(deployAccount)
    let tx = await ec.setApprovalForAll(subdomainContract.address, true)
    await tx.wait()

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

    let certificateId = await subdomainContract.certificateId(domainLabel, certAccount.address)
    console.log("CERT ID: " + certificateId)
    let cidBytes = ethers.utils.arrayify(certificateId)
    let signature = deployAccount.signMessage(cidBytes)
    console.log("createAndSignCertificate done")
    return signature
}

const createMetaTx = async (sig) => {
    console.log("Creating meta transaction...")
    let nonce = await metaProxyContract.nonces(deployAccount.address)
    let metaContract = subdomainContract.connectMeta(certAccount.toMetaWallet())

    let domainHash = ethers.utils.id(domain)

    let mtx = await metaContract.registerCertificate(domainHash, subdomain, utils.emptyAddress, newrinkebyResolver, sig, {nonce})


    return mtx
}

const runMeta = async (rlp) => {
    console.log("Posting meta transaction to blockchain...")
    let anotherAccount = utils.ethersAccount(2)
    let con = metaProxyContract.connect(anotherAccount)
    let tx = await con.proxy(rlp)
    await tx.wait()
    //console.log(tx)
}


const registerCertificate = async (sig) => {
    console.log("registerCertificate...")
    const contract = subdomainContract.connect(altAccount)
    let domainHash = ethers.utils.id(domain)

    let tx = await contract.registerCertificate(domainHash, subdomain, utils.emptyAddress, newrinkebyResolver, sig)
    await tx.wait()

    console.log("registerCertificate done")
}

const getControlBack = async () => {
    let domainNamehash = ethers.utils.namehash(domainFull)
    let domainHash = ethers.utils.id(domain)

    let ensOwner = await ensContract.owner(domainNamehash);
    console.log("Domain Owner: "  + ensOwner)
    const subdomainContract = utils.getDeployedContract('RapidSubdomainRegistrarMeta')

    let sdc = new ethers.Contract(ensOwner, subdomainContract.interface.abi, deployAccount)
    let tx = await sdc.withdrawDomain(domainHash)
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