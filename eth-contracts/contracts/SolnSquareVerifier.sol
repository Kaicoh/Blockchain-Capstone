pragma solidity >=0.4.21 <0.6.0;

import "../../zokrates/code/square/verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {} // solium-disable-line no-empty-blocks

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    mapping (bytes32 => bool) private solutions;

    SquareVerifier squareVerifier;

    event SolutionAdded(address indexed account);

    constructor(address verifier) public {
        squareVerifier = SquareVerifier(verifier);
    }

    function mint(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata input
    )
        external
    {
        require(_verifySolution(a, b, c, input), "Invalid solution");

        bytes32 key = _buildSolutionKey(a, b, c, input);
        require(!solutions[key], "Duplicate solution");

        _addSolution(key);

        uint256 tokenId = totalSupply();
        super._mint(msg.sender, tokenId);
        super.setTokenURI(tokenId);
    }

    function _verifySolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    )
        private
        returns (bool)
    {
        return squareVerifier.verifyTx(a, b, c, input);
    }

    function _addSolution(bytes32 key) private {
        solutions[key] = true;
        emit SolutionAdded(msg.sender);
    }

    function _buildSolutionKey(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    )
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(a, b, c, input));
    }
}
