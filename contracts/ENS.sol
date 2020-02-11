pragma solidity >=0.4.24;

interface ENS {

    // Logged when the _owner of a node assigns a new _owner to a subnode.
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address _owner);

    // Logged when the _owner of a node transfers _ownership to a new account.
    event Transfer(bytes32 indexed node, address _owner);

    // Logged when the resolver for a node changes.
    event NewResolver(bytes32 indexed node, address resolver);

    // Logged when the TTL of a node changes
    event NewTTL(bytes32 indexed node, uint64 ttl);

    // Logged when an operator is added or removed.
    event ApprovalForAll(address indexed _owner, address indexed operator, bool approved);

    function setRecord(bytes32 node, address _owner, address resolver, uint64 ttl) external;
    function setSubnodeRecord(bytes32 node, bytes32 label, address _owner, address resolver, uint64 ttl) external;
    function setSubnodeOwner(bytes32 node, bytes32 label, address _owner) external returns(bytes32);
    function setResolver(bytes32 node, address resolver) external;
    function setOwner(bytes32 node, address _owner) external;
    function setTTL(bytes32 node, uint64 ttl) external;
    function setApprovalForAll(address operator, bool approved) external;
    function owner(bytes32 node) external view returns (address);
    function resolver(bytes32 node) external view returns (address);
    function ttl(bytes32 node) external view returns (uint64);
    function recordExists(bytes32 node) external view returns (bool);
    function isApprovedForAll(address _owner, address operator) external view returns (bool);
}