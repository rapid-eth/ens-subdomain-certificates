require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider

const emptyBytes = "0x0000000000000000000000000000000000000000000000000000000000000000"

const newrinkebyResolver = "0xdaaf96c344f63131acadd0ea35170e7892d3dfba"

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

const abi = require("../build/contracts/ENS.json").abi
const ensContract = utils.getContract(ENS_REGISTRY_ADDRESS, abi)
//const ensContract = utils.getDeployedContract('ENSRegistry')

const subdomainContract = utils.getDeployedContract('RapidSubdomainRegistrarMeta')
const metaProxyContract = utils.getDeployedContract('MetaProxy')




let pk = "D18BBBEDDB59044A2805A277F804828149488252C7049A7088485F3CFD4DAB63"
let deployAccount = new ethers.Wallet(pk, provider)


// const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)
const certAccount = utils.ethersAccount(3)

const base = "eth"
const domain = "milliondevs"
const subdomain = "joe"
const domainFull = domain + "." + base
const subdomainFull = subdomain + "." + domainFull


const main = async () => {
    console.log("Running Main Task...")

    console.log("Subdomain Contract address: " + subdomainContract.address)
    console.log("Metaproxy Contract address: " + metaProxyContract.address)

    await printInfo()
    
    // await configure()
    // await transferOwnership()
    // await transfer()

    // await printInfo()


    console.log("Done")
}

const configure = async () => {
    const contract = subdomainContract.connect(deployAccount)
    console.log("configure...")

    let price = ethers.utils.parseEther(".05")
    let kames = "0x1cc1C78bcfA5e872cCEBa516Ef821E30A280A9bB"
    let billy = "0xF9963dbe9438A5ECb62e5e7c2C081C3d12D48dd5"
    let rob = "0x1CEb4c4E01fba4C8A4513bca2929f3C68715514D"
    let delegates = [kames, billy, rob]
    let tx = await contract.configureDomainWithDelegates(domain, price, delegates);
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

const transfer = async () => {
    let teamGnosis = "0x60B45ca01C476262E885Ba4f1F84d704F58b3da9"
    const contract = subdomainContract.connect(deployAccount)
    let tx = await contract.transfer(domain,teamGnosis);
    await tx
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