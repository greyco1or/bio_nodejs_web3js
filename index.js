import Web3 from "web3";
import erc20Abi from "./erc20.abi.json" assert { type: "json" };
const web3 = new Web3('https://mainnet.bitonechain.com/');


async function getBlockInfo() {
    try {
        const blockNumber = await web3.eth.getBlockNumber(); // 최신 블록 번호 가져오기
        const block = await web3.eth.getBlock(blockNumber, true); // 최신 블록 정보 가져오기 (with transactions)
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ NEW BLOCK GENERATE START @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(`Latest block number: ${block.number}`);
        console.log(`Latest block hash: ${block.hash}`);
        console.log(`Number of transactions in latest block: ${block.transactions.length}`);
        if(block.transactions.length == 0) {
            console.log("BLOCK IS EMPTY. THERE IS NO TRANSACTION");
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ NEW BLOCK GENERATE FINISH @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            return;
        }
        console.log('Transactions in latest block:');
        block.transactions.forEach(async (tx, index) => {
            const txRecipt = await web3.eth.getTransactionReceipt(tx.hash)
            if(txRecipt.logs.length != 0) {
                console.log("------------------------- TRANSACTION RECEIPT START(TOKEN TRANSFER) -------------------------");
                console.log(`Transactions Hash: ${tx.hash}`)
                console.log(`Transaction From Address: ${tx.from}`);
                console.log(`Transaction To Address: ${tx.to}`);
                const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                console.log(`Transaction Gas Fee: ${web3.utils.fromWei(gasFee.toString(), 'ether')} BIO`);
                const tokenValue = web3.utils.hexToNumberString(txRecipt.logs[0].data);
                const tokenContract = txRecipt.logs[0].address;
                console.log(`Transaction SmartContract Address: ${tokenContract}`);
                const contract = new web3.eth.Contract(erc20Abi, tokenContract);
                const tokenObj = await getSmartContractData(contract);
                console.log(`Transaction Token Name: ${tokenObj.tokenName}`);
                console.log(`Transaction Token Value: ${tokenValue / 10 ** tokenObj.tokenDecimal}` + ` ${tokenObj.tokenSymbol}`);
                //console.log(`Transaction Token Value: ${web3.utils.fromWei(tokenValue.toString(), 'ether')}` + ` ${tokenObj.tokenSymbol}`)
                console.log("------------------------- TRANSACTION RECEIPT FINISH(TOKEN TRANSFER) --------------------------");
            } else {
                console.log("****************************** TRANSACTION RECEIPT START(COIN TRANSFER) ******************************");
                console.log(`Transactions Hash: ${tx.hash}`)
                console.log(`Transaction From Address: ${tx.from}`);
                console.log(`Transaction To Address: ${tx.to}`);
                const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                console.log(`Transaction Gas Fee: ${web3.utils.fromWei(gasFee.toString(), 'ether')} BIO`);
                console.log(`Transaction Coin Value: ${web3.utils.fromWei(tx.value.toString(), 'ether')} BIO`);
                console.log("****************************** TRANSACTION RECEIPT FINISH(COIN TRANSFER) ******************************");
            }
            if (index == block.transactions.length -1 || block.transactions.length == 0) {
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ NEW BLOCK GENERATE FINISH @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            }
        })
    } catch (error) {
      console.error(error);
    }
}

async function getSmartContractData(contract) {
    class tokenData {
        constructor(tokenName, tokenDecimal, tokenSymbol) {
            this.tokenName = tokenName;
            this.tokenDecimal = tokenDecimal;
            this.tokenSymbol = tokenSymbol;
        }
    }
    const tokenName = await contract.methods.name().call();
    const tokenDecimal = await contract.methods.decimals().call();
    const tokenSymbol = await contract.methods.symbol().call();

    const tokenObj = new tokenData(tokenName, tokenDecimal, tokenSymbol);

    return tokenObj;
}   

getBlockInfo();
setInterval(getBlockInfo, 3000);