import Web3 from "web3";
const web3 = new Web3('https://mainnet.bitonechain.com/');


async function getLatestBlockInfo() {
    try {
        const blockNumber = await web3.eth.getBlockNumber(); // 최신 블록 번호 가져오기
        const block = await web3.eth.getBlock(11180571, true); // 최신 블록 정보 가져오기 (with transactions)
        console.log(`Latest block number: ${block.number}`);
        console.log(`Latest block hash: ${block.hash}`);
        //console.log(`Number of transactions in latest block: ${block.transactions.length}`);
        //console.log(`transactions in latest block: ${block.transactions}`);
        console.log('Transactions in latest block:');
        block.transactions.forEach((tx) => {
            const transactinoReceipt = web3.eth.getTransactionReceipt(tx.hash).then(
                (txRecipt) => {
                    if(txRecipt.logs.length != 0) {
                        console.log("########################### TRANSACTION RECEIPT START(TOKEN TRANSFER) ##################################");
                        console.log(`Transactions Hash: ${tx.hash}`)
                        console.log(`Transaction From Address: ${tx.from}`);
                        console.log(`Transaction To Address: ${tx.to}`);
                        //console.log(txRecipt);
                        console.log(txRecipt.logs[0]);
                        const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                        console.log(`Transaction Gas Fee: ${web3.utils.fromWei(gasFee.toString(), 'ether')} BIO`);
                        const tokenValue = web3.utils.hexToNumberString(txRecipt.logs[0].data);
                        console.log(`Transaction Token Value: ${web3.utils.fromWei(tokenValue.toString(), 'ether')} DST`)
                        console.log("########################### TRANSACTION RECEIPT FINISH(TOKEN TRANSFER) ##################################");
                    } else {
                        console.log("****************************** TRANSACTION RECEIPT START ******************************");
                        console.log(`Transactions Hash: ${tx.hash}`)
                        console.log(`Transaction From Address: ${tx.from}`);
                        console.log(`Transaction To Address: ${tx.to}`);
                        const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                        console.log(`Transaction Gas Fee: ${web3.utils.fromWei(gasFee.toString(), 'ether')} BIO`);
                        console.log(`Transaction Coin Value: ${web3.utils.fromWei(tx.value.toString(), 'ether')} BIO`);
                        console.log("****************************** TRANSACTION RECEIPT FINISH ******************************");
                    }
                }
            )    
        })
    } catch (error) {
      console.error(error);
    }
}
getLatestBlockInfo();