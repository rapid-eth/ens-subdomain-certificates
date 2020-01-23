pragma solidity ^0.5.0;

import "../ens/ENS.sol";

/**
 * @dev A basic interface for ENS resolvers.
 */
contract Resolver {
    function supportsInterface(bytes4 interfaceID) public pure returns (bool);
    function addr(bytes32 node) public view returns (address);
    function setAddr(bytes32 node, address addr) public;
}
