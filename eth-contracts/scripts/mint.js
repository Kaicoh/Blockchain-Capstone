const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const SolnSquareVerifier = require('../build/contracts/SolnSquareVerifier.json');

require('dotenv').config();

const { INFURA_KEY, MNEMONIC, NETWORK } = process.env;

if (!INFURA_KEY || !MNEMONIC || !NETWORK) {
    throw new Error('Not found environment variables. INFURA_KEY, MNEMONIC and NETWORK.');
}

const fsPromise = fs.promises;
const proofsDir = path.join(__dirname, 'proofs');

/* **********************************
    UTILITY FUNCTIONS
 ************************************ */

const getAccount = web3 => (
    web3.eth.getAccounts()
        .then(accounts => accounts[0])
);

const getContract = web3 => (
    web3.eth.net.getId()
        .then((networkId) => {
            const deployedNetwork = SolnSquareVerifier.networks[networkId];
            return new web3.eth.Contract(
                SolnSquareVerifier.abi,
                deployedNetwork && deployedNetwork.address,
            );
        })
);

const readProof = (filename) => {
    const filePath = path.join(proofsDir, filename);
    return fsPromise
        .readFile(filePath)
        .then(JSON.parse);
};

const getProofs = () => fsPromise
    .readdir(proofsDir)
    .then(filenames => Promise.all(filenames.map(readProof)));

const mint = (account, contract, proof) => {
    const { proof: { a, b, c }, inputs } = proof;
    return contract
        .methods
        .mint(a, b, c, inputs)
        .send({ from: account })
        .then((receipt) => {
            // eslint-disable-next-line no-console
            console.log(`Minted token. Transaction: ${receipt.transactionHash}`);
        });
};

const mintAll = ([account, contract, proofs]) => Promise.all(
    proofs.map(proof => mint(account, contract, proof)),
);

/* **********************************
    MAIN FUNCTION
 ************************************ */

const main = () => {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`);
    const web3 = new Web3(provider);

    return Promise.all([getAccount(web3), getContract(web3), getProofs()])
        .then(mintAll)
        .catch(console.log); // eslint-disable-line no-console
};

main();
