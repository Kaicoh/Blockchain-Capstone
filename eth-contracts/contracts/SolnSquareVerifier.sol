pragma solidity ^0.5.0;

import "../../zokrates/code/square/verifier.sol";
import "./TradeableERC721Token.sol";

contract SquareVerifier is Verifier {} // solium-disable-line no-empty-blocks

contract SolnSquareVerifier is TradeableERC721Token {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    mapping (bytes32 => bool) private solutions;

    SquareVerifier squareVerifier;

    event SolutionAdded(address indexed account);

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    constructor(address _squareVerifierAddress, address _proxyRegistryAddress)
        TradeableERC721Token("BlockchainND Capstone Token", "BCT", _proxyRegistryAddress)
        public
    {
        squareVerifier = SquareVerifier(_squareVerifierAddress);
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

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
        mintTo(msg.sender);
    }

    function baseTokenURI() public pure returns (string memory) {
        return "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    }

    /********************************************************************************************/
    /*                                     PRIVATE FUNCTIONS                                    */
    /********************************************************************************************/

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
