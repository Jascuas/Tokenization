const Token = artifacts.require("MyToken");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("Token text", async (accounts) => {

    const [deployerAccount, recipent, anotherAccount] = accounts;

    it("all tokens should be in my account", async () => {
        let instance = await Token.deployed();
        let totalsupply = await instance.totalSupply();
        let balance = instance.balanceOf(deployerAccount);
        expect(balance).to.eventually.be.a.bignumber.equal(totalsupply);
    })

    
    it("it is not possible to send more tokens than avariable in total", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf(deployerAccount);
        await expect(instance.transfer(recipent, new BN(balance+1))).to.eventually.be.rejected;

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balance);
    })
    
    it("is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = await Token.deployed();
        let totalsupply = await instance.totalSupply();
        let balance = instance.balanceOf(deployerAccount);
        expect(balance).to.be.eventually.a.bignumber.equal(totalsupply);
        expect(instance.transfer(recipent, sendTokens)).to.eventually.be.fulfilled;
        expect(balance).to.be.eventually.a.bignumber.equal(totalsupply.sub(new BN(sendTokens)));
        expect(instance.balanceOf(recipent)).to.be.eventually.a.bignumber.equal(new BN(sendTokens));
    })

});