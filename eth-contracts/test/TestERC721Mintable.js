const ERC721Mintable = artifacts.require('ERC721Mintable');

contract('ERC721Mintable', (accounts) => {
    let instance;
    const [
        owner,
        account1,
        account2,
    ] = accounts;

    describe('match erc721 spec', () => {
        beforeEach(async () => {
            instance = await ERC721Mintable.new({ from: owner });

            await instance.mint(account1, 1, { from: owner });
            await instance.mint(account2, 2, { from: owner });
            await instance.mint(account1, 3, { from: owner });
        });

        it('should return total supply', async () => {
            const totalSupply = await instance.totalSupply.call();
            assert.equal(totalSupply, 3);
        });

        it('should get token balance', async () => {
            const balance = await instance.balanceOf.call(account1);
            assert.equal(balance, 2);
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async () => {
            const tokenURI = await instance.tokenURI.call(1);
            assert.match(
                tokenURI,
                /^https:\/\/s3-us-west-2\.amazonaws\.com\/udacity-blockchain\/capstone\/1$/,
            );
        });

        it('should transfer token from one owner to another', async () => {
            const tokenId = 3;
            await instance.transferFrom(account1, account2, tokenId, { from: account1 });
            const tokenOwner = await instance.ownerOf.call(tokenId);
            assert.equal(tokenOwner, account2);
        });
    });

    describe('have ownership properties', () => {
        beforeEach(async () => {
            instance = await ERC721Mintable.new({ from: owner });
        });

        it('should fail when minting when address is not contract owner', async () => {
            try {
                await instance.mint(account1, 1, { from: account1 });
                throw new Error('unreachable error');
            } catch (error) {
                assert.notMatch(error.message, /unreachable error/);
            }
        });

        it('should return contract owner', async () => {
            const contractOwner = await instance.owner.call();
            assert.equal(contractOwner, owner);
        });
    });
});
