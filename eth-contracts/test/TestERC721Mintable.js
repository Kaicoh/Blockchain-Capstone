const ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', (accounts) => { // eslint-disable-line no-unused-vars
    let instance; // eslint-disable-line no-unused-vars
    // const account_one = accounts[0];
    // const account_two = accounts[1];

    describe('match erc721 spec', () => {
        beforeEach(async () => {
            instance = await ERC721MintableComplete.deployed();

            // TODO: mint multiple tokens
        });

        it('should return total supply');

        it('should get token balance');

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri');

        it('should transfer token from one owner to another');
    });

    describe('have ownership properties', () => {
        beforeEach(async () => {
            instance = await ERC721MintableComplete.deployed();
        });

        it('should fail when minting when address is not contract owner');

        it('should return contract owner');
    });
});
