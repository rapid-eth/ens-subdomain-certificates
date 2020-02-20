require('module-alias/register')

const ethers = require("../../meta-lib").ethers;
//uncomment and run `npm install ipfs-http-client` to use IPFS
//const ipfs = require("./ipfs");
const misc = require("./misc");
const signing = require("./signing");
const fs = require("fs")

const url = "http://127.0.0.1:7545";
let provider;
let networkID
let networkName
if (process.env.NETWORK === "mainnet") {
  //provider = ethers.getDefaultProvider('rinkeby');
  const infuraURL = 'https://mainnet.infura.io/v3/3bbfc77a4c3b4c8abf44928522104e9a'
  provider = new ethers.providers.JsonRpcProvider(infuraURL);
  networkID = "1";
  networkName = 'mainnet'
} else if (process.env.NETWORK === "rinkeby") {
  //provider = ethers.getDefaultProvider('rinkeby');
  const infuraURL = 'https://rinkeby.infura.io/v3/9dd73bc075d441f684db7bc34f4e5950'
  provider = new ethers.providers.JsonRpcProvider(infuraURL);
  networkID = "4";
  networkName = 'rinkeby'
} else if (process.env.NETWORK === "local" || process.env.NETWORK === "ganache" ) {
  provider = new ethers.providers.JsonRpcProvider(url);
  networkID = "5777"; //todo
  networkName = 'ganache'
} else {
  console.warn("No NETWORK specified defaulting to \"ganache\"")
  provider = new ethers.providers.JsonRpcProvider(url);
  networkID = "5777"; //todo
  networkName = 'ganache'
}

const secrets = require('@root/secrets.json')
const mnemonic = secrets.mnemonic;

const ethersAccount = i => {
  const path = "m/44'/60'/0'/0/" + i;
  const w = ethers.Wallet.fromMnemonic(mnemonic, path);
  return new ethers.Wallet(w.signingKey.privateKey, provider);
};

const getContract = (address, abi) => {
  return new ethers.Contract(address, abi, provider);
}
const readDeployedFile = (name) => {
  let contract = require(`@deployed/${networkName}/${name}.json`)
  return contract
}
const getDeployedContract = (name) => {
  let contract = require(`@deployed/${networkName}/${name}.json`)
  return getContract(contract.networks[networkID].address, contract.abi)
}

const getDeployedContractWithAddress = (name,address) => {
  let contract = require(`@deployed/${networkName}/${name}.json`)
  return getContract(address, contract.abi)
}



const deployContractAndWriteToFile = async (contractName, deployerWallet, params) => {
  //check if output dir exists, if not create it
  const outputDirRoot = `./build/deployed`;
  // console.log(fs.existsSync('./build'))
  if (!fs.existsSync(outputDirRoot)) {
    fs.mkdirSync(outputDirRoot);
  }

  const outputDir = `${outputDirRoot}/${networkName}`
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  let contract = require(`@contracts/${contractName}.json`)

  let deployedContract = await signing.deployContract(
    contract.abi,
    contract.bytecode,
    deployerWallet,
    params
  );
  let networks = {}
  networks[networkID] = {
    address: deployedContract.address,
    transactionHash: deployedContract.deployTransaction.hash,
  }

  let truffleLike = {
    contractName,
    name: contractName,
    abi: contract.abi,
    bytecode: contract.bytecode,
    networks
  }
  misc.writeToFile(`${outputDir}/${contractName}.json`, truffleLike)

  return deployedContract
}


const emptyAddress = '0x0000000000000000000000000000000000000000'

module.exports = {
  // ...ipfs,
  ethers,
  ...misc,
  ...signing,
  readDeployedFile,
  getDeployedContract,
  networkID,
  networkName,
  ethersAccount,
  provider,
  getContract,
  emptyAddress,
  parseUnits: ethers.utils.parseUnits,
  deployContractAndWriteToFile,
  getDeployedContractWithAddress
};
