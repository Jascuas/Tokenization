const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
var KycContract = artifacts.require("KycContract");
require("dotenv").config({path: "../.env"});
const chai = require("./setupchai");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale text", async (accounts) => {

    const [deployerAccount, recipent, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        let instance = await Token.deployed();
        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all tokens should be in the TokenSale Smart Contract by default", async () => {
        let instanceToken = await Token.deployed();
        let balanceTokenSale = await instanceToken.balanceOf(TokenSale.address);
        let totalsupply = await instanceToken.totalSupply();
        return await expect(balanceTokenSale).to.be.a.bignumber.equal(totalsupply);
    })

    it("should be possible to buy tokens", async () => {
        let instanceToken = await Token.deployed();
        let instanceSale = await TokenSale.deployed();
        let instanceKyc = await KycContract.deployed();
        let balanceBefore = await instanceToken.balanceOf(deployerAccount);
        await instanceKyc.setKycCompleted(deployerAccount, {from: deployerAccount} )
        await expect(instanceSale.sendTransaction({
            from: deployerAccount,
            value: web3.utils.toWei("1", "wei")
        })).to.be.fulfilled;
        return await expect(instanceToken.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));
    })

});