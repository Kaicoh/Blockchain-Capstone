const SquareVerifier = artifacts.require('SquareVerifier');
const proof = require('../../zokrates/code/square/proof.json');

contract('SquareVerifier', () => {
    let instance;

    beforeEach(async () => {
        instance = await SquareVerifier.deployed();
    });

    it('returns true when using correct proof', async () => {
        const { proof: { a, b, c }, inputs } = proof;
        const result = await instance.verifyTx.call(a, b, c, inputs);
        assert.equal(result, true);
    });

    it('returns false when using incorrect proof', async () => {
        const { proof: { a, b }, inputs } = proof;
        const c = [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        ];
        const result = await instance.verifyTx.call(a, b, c, inputs);
        assert.equal(result, false);
    });
});
