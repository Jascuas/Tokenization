const Token = artifacts.require("MyToken");
 require("dotenv").config({path: "../.env"});

 const chai = require("./setupchai");
 const BN = web3.utils.BN;
 const expect = chai.expect;

contract("Token text", async (accounts) => {

    const [deployerAccount, recipent, anotherAccount] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("all tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalsupply = await instance.totalSupply();
        let balance = instance.balanceOf(deployerAccount);
        return await expect(balance).to.eventually.be.a.bignumber.equal(totalsupply);
    })
    
    it("is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalsupply = await instance.totalSupply();
        let balance = instance.balanceOf(deployerAccount);
        await expect(balance).to.be.eventually.a.bignumber.equal(totalsupply);
        await expect(instance.transfer(recipent, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.be.eventually.a.bignumber.equal(totalsupply.sub(new BN(sendTokens)));
        return await expect(instance.balanceOf(recipent)).to.be.eventually.a.bignumber.equal(new BN(sendTokens));
    })

    it("it is not possible to send more tokens than avariable in total", async () => {
        let instance = this.myToken;
        let balance = await instance.balanceOf(deployerAccount);
        await expect(instance.transfer(recipent, new BN(balance+1))).to.eventually.be.rejected;

        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balance);
    })
    
});