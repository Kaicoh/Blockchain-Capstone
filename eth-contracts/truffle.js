const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config();

const { INFURA_KEY, MNEMONIC } = process.env;

if (!INFURA_KEY || !MNEMONIC) {
    throw new Error('Not found environment variables. INFURA_KEY or MNEMONIC.');
}

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },

        rinkeby: {
            provider: () => new HDWalletProvider(
                MNEMONIC,
                `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
            ),
            network_id: 4,
            gas: 6500000,
            gasPrice: 10000000000,
        },
    },

    compilers: {
        solc: {
            version: '0.5.2',
        },
    },
};
