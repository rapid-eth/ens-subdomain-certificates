pragma solidity ^0.6.2;

import "./ENS.sol";

/**
 * @dev A basic interface for ENS resolvers.
 */
abstract contract Resolver {
    function supportsInterface(bytes4 interfaceID) public virtual pure returns (bool);
    function addr(bytes32 node) public virtual view returns (address);
    function setAddr(bytes32 node, address _addr) public virtual;
}
