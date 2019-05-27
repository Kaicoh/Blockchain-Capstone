const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions'); // eslint-disable-line import/no-extraneous-dependencies
const proof = require('../../zokrates/code/square/proof.json');

contract('SolnSquareVerifier', (accounts) => {
    let instance;

    beforeEach(async () => {
        instance = await SolnSquareVerifier.deployed();
    });

    describe('mint function', () => {
        it('adds new solution', async () => {
            const { proof: { a, b, c }, inputs } = proof;
            const tx = await instance.mint(a, b, c, inputs, { from: accounts[1] });
            truffleAssert.eventEmitted(
                tx,
                'SolutionAdded',
                event => event.account === accounts[1],
            );
        });

        it('increments total supply', async () => {
            const totalSupply = await instance.totalSupply.call();
            assert.equal(totalSupply, 1);
        });

        it('assign new token to msg.sender', async () => {
            const tokenId = 0; // first tokenId is 0
            const owner = await instance.ownerOf.call(tokenId);
            assert.equal(owner, accounts[1]);
        });
    });
});
