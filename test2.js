import Web3 from "web3";
import tokenAbi from "./contracts/67bcdfe2d5f9e3dc1419da6fe9b9dc5b.json" assert { type : "json"};
const web3 = new Web3('https://mainnet.bitonechain.com/');

console.log(tokenAbi);
async function getContractFuc() {
    try {
        const tokenContract = new web3.eth.Contract(tokenAbi, "0x0A4440709F307aa0186eB57E9A299e2F5171Cc2f");
        await tokenContract.methods.name().call((err, name) => {
            console.log(name);
        });
    } catch(err) {
        console.error(err);
    }
}

getContractFuc();