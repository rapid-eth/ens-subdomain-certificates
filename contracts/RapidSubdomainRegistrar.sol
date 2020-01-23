pragma solidity ^0.5.0;

import "./SimpleSubdomainRegistrar.sol";
import "./openzeppelin-solidity/cryptography/ECDSA.sol";

contract RapidSubdomainRegistrar is SimpleSubdomainRegistrar {

    using ECDSA for bytes32;

    // mapping (address => bool) delegates;
    mapping (bytes32 => bool) public certificateRedeemed;

    constructor(ENS ens) SimpleSubdomainRegistrar(ens) public { }

    // override
    // struct Domain {
    //     string name;
    //     address payable owner;
    //     uint price;
    //     mapping (address => bool) delegates;
    // }


    /**
     * @dev Configures a domain for sale.
     * @param name The name to configure.
     * @param price The price in wei to charge for subdomain registrations
     * @param delegates Array of signer delegates
     */
    function configureDomainWithDelegates(string memory name, uint price, address[] memory delegates) public {
        configureDomainFor(name, price, msg.sender);
        bytes32 label = keccak256(bytes(name));
        Domain storage domain = domains[label];
        
        domain.delegates[msg.sender] = true;

        for (uint8 i = 0; i < delegates.length; i++) {
            domain.delegates[delegates[i]] = true;
        }
    }

    function addDelegate(string memory name, address delegate) public owner_only(keccak256(bytes(name))) {
        bytes32 label = keccak256(bytes(name));
        domains[label].delegates[delegate] = true;
    }



    // Allow transfering back control of domain to previous owner
    function withdrawDomain(bytes32 label) public  owner_only(label) {
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, label));
        ens.setOwner(domainNode, msg.sender);
    }

    // Create a certificate (View)

    function certificateId(bytes32 domainLabel, address userAddress) public view returns (bytes32) {
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, domainLabel));
        return keccak256(abi.encodePacked(domainNode, address(this), userAddress));
    }


    // Register with certificate

    function registerCertificate(
        bytes32 domainLabel,
        string memory subdomain,
        address _subdomainOwner,
        address resolver,
        bytes memory signature
        ) public not_stopped
    {
        address subdomainOwner = _subdomainOwner;
        bytes32 domainNode = keccak256(abi.encodePacked(TLD_NODE, domainLabel));
        bytes32 subdomainLabel = keccak256(bytes(subdomain));
        require(ens.owner(keccak256(abi.encodePacked(domainNode, subdomainLabel))) == address(0), "subdomain taken");

        //verify certificate
        require(verifyCertificate(domainLabel, signature), "certificate not valid");
        bytes32 cid = certificateId(domainLabel, msg.sender);
        certificateRedeemed[cid] = true;

        if (subdomainOwner == address(0x0)) {
            subdomainOwner = msg.sender;
        }

        doRegistration(domainNode, subdomainLabel, subdomainOwner, Resolver(resolver));
    }

    function verifyCertificate(bytes32 domainLabel, bytes memory signature) internal view returns (bool) {
        bytes32 cid = certificateId(domainLabel, msg.sender);
        if (certificateRedeemed[cid]) {
            return false;
        }
        address signer = cid.toEthSignedMessageHash().recover(signature);
        return domains[domainLabel].delegates[signer];
    }

}