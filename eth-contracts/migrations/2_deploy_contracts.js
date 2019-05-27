// migrating the appropriate contracts
const CapstoneToken = artifacts.require('CapstoneToken');
// const SquareVerifier = artifacts.require('SquareVerifier');
// const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

module.exports = function (deployer) {
    deployer.deploy(CapstoneToken);
    // deployer.deploy(SquareVerifier);
    // deployer.deploy(SolnSquareVerifier);
};
