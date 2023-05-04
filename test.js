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
            console.log(tx);
            const transactinoReceipt = web3.eth.getTransactionReceipt(tx.hash).then(
                (txRecipt) => {
                    if(txRecipt.logs.length != 0) {
                        console.log("########################### TRANSACTION RECEIPT START(TRANSFER) ##################################");
                        console.log(txRecipt);
                        console.log("########################### TRANSACTION RECEIPT FINISH(TRANSFER) ##################################");
                    } else {
                        console.log("****************************** TRANSACTION RECEIPT START ******************************");
                        console.log(txRecipt);
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