const ethers = require('ethers')

const provider = ethers.getDefaultProvider("mainnet")

const privateKey = "<YOUR PRIVATE KEY HERE>"
let signer = new ethers.Wallet(privateKey, provider)

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" //on all public networks

let subdomainAddress = "0x7C5b67c5Cb0eCdC591247aADE467d55C4A192d7E"

const main = async () => {
    const subdomainContract = new ethers.Contract(subdomainAddress, subdomainABI, signer)
    const registryContract = new ethers.Contract(ENS_REGISTRY_ADDRESS, ensRegistryABI, signer)

    let kames = "0x1cc1C78bcfA5e872cCEBa516Ef821E30A280A9bB"
    let billy = "0xF9963dbe9438A5ECb62e5e7c2C081C3d12D48dd5"
    let rob = "0x1CEb4c4E01fba4C8A4513bca2929f3C68715514D"
    let delegates = [kames, billy, rob]

    let domain = "milliondevs"
    let price = ethers.utils.parseEther(".05")

    let tx = await subdomainContract.configureDomainWithDelegates(domain, price, delegates);
    console.log(tx)

    let tx2 = await registryContract.setApprovalForAll(subdomainContract.address, true)
    console.lot(tx2)
}

let subdomainABI = [
    {
        "inputs": [
            {
                "internalType": "contract ENS",
                "name": "_ens",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_metaProxy",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "DomainTransferred",
        "type": "event",
        "signature": "0x8c0dd32279c25300d82425bebe31a5c703918d83d2bb57a1155dfa6cbba61cf8"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "subdomain",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "NewRegistration",
        "type": "event",
        "signature": "0x4139ce95b7c4117d57ba8f9bdc08261e7c56232e6a7aeeed31e567fa7fac1946"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "TransferAddressSet",
        "type": "event",
        "signature": "0x2d7de2863f470ffa77d12170d4a38ab17226373c6d1d81d1cc75defe123e45fe"
    },
    {
        "inputs": [],
        "name": "TLD_NODE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x96df3540"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            }
        ],
        "name": "addDelegate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xdb850a4a"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            }
        ],
        "name": "bytesToUint",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "signature": "0xcfc5a969"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "domainLabel",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "certificateId",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x7bc0dbd1"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "certificateRedeemed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0xc4c6646e"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "configureDomain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x503f8fa5"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "configureDomainFor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x9b5530c3"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "delegates",
                "type": "address[]"
            }
        ],
        "name": "configureDomainWithDelegates",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x1ca8f4ae"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            }
        ],
        "name": "domainNode",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "signature": "0x3c8671c9"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "domains",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address payable",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0xc722f177"
    },
    {
        "inputs": [],
        "name": "ens",
        "outputs": [
            {
                "internalType": "contract ENS",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x3f15457f"
    },
    {
        "inputs": [],
        "name": "metaTxProxyContract",
        "outputs": [
            {
                "internalType": "contract MetaProxy",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0xac70d7ba"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "nameToLabel",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "signature": "0x55a2bfe2"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            }
        ],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x02571be3"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "subdomain",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_subdomainOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            }
        ],
        "name": "register",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "signature": "0x4b7d0927"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "domainLabel",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "subdomain",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_subdomainOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "registerCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x5f07ed47"
    },
    {
        "inputs": [],
        "name": "registrarOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x1cb82d79"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            }
        ],
        "name": "setResolver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x733ccaba"
    },
    {
        "inputs": [],
        "name": "stop",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x07da68f5"
    },
    {
        "inputs": [],
        "name": "stopped",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x75f12b21"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address payable",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xfbf58b3e"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xf2fde38b"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "unlistDomain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xe34e7889"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            }
        ],
        "name": "withdrawDomain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xeec73fd3"
    }
]


let ensRegistryABI = [
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event",
        "signature": "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "NewOwner",
        "type": "event",
        "signature": "0xce0457fe73731f824cc272376169235128c118b49d344817417c6d108d155e82"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            }
        ],
        "name": "NewResolver",
        "type": "event",
        "signature": "0x335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "ttl",
                "type": "uint64"
            }
        ],
        "name": "NewTTL",
        "type": "event",
        "signature": "0x1d4f9bbfc9cab89d66e1a1562f2233ccbf1308cb4f63de2ead5787adddb8fa68"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "Transfer",
        "type": "event",
        "signature": "0xd4735d920b0f87494915f556dd9b54c8f309026070caea5c737245152564d266"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xe985e9c5"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            }
        ],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x02571be3"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            }
        ],
        "name": "recordExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xf79fe538"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            }
        ],
        "name": "resolver",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x0178b8bf"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xa22cb465"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "setOwner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x5b0fc9c3"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "ttl",
                "type": "uint64"
            }
        ],
        "name": "setRecord",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xcf408823"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            }
        ],
        "name": "setResolver",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x1896f70a"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "setSubnodeOwner",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x06ab5923"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "label",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "resolver",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "ttl",
                "type": "uint64"
            }
        ],
        "name": "setSubnodeRecord",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x5ef2c7f0"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            },
            {
                "internalType": "uint64",
                "name": "ttl",
                "type": "uint64"
            }
        ],
        "name": "setTTL",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x14ab9038"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "node",
                "type": "bytes32"
            }
        ],
        "name": "ttl",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x16a25cbd"
    }
]
main()