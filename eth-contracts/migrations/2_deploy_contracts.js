const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

module.exports = async function (deployer, network, accounts) {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    let proxyRegistryAddress = '';
    if (network === 'rinkeby') {
        proxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';
    } else if (network === 'mainnet') {
        proxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';
    } else {
        [proxyRegistryAddress] = accounts; // for development
    }

    await deployer.deploy(SquareVerifier);
    await deployer.deploy(SolnSquareVerifier, SquareVerifier.address, proxyRegistryAddress);
};
