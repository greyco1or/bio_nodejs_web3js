import Web3 from "web3";
const web3 = new Web3('https://mainnet.bitonechain.com/');


async function getBlockInfo() {
    try {
        const blockNumber = await web3.eth.getBlockNumber(); // 최신 블록 번호 가져오기
        const block = await web3.eth.getBlock(11180693, true); // 최신 블록 정보 가져오기 (with transactions)
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
                        const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                        console.log(`Transaction Gas Fee: ${web3.utils.fromWei(gasFee.toString(), 'ether')} BIO`);
                        const tokenValue = web3.utils.hexToNumberString(txRecipt.logs[0].data);
                        const tokenContract = txRecipt.logs[0].address;
                        let tokenName = "";
                        console.log(`Transaction SmartContract Address: ${tokenContract}`);
                        switch (tokenContract) {
                            case "0x51Ee7bB106B581f7cdDab5fA1e9B8A4F4eBca565": 
                                console.log("Token Name: CJB");
                                tokenName = "CJB";
                                break;
                            case "0x0A4440709F307aa0186eB57E9A299e2F5171Cc2f":
                                console.log("Token Name: DST");
                                tokenName = "DST";
                                break;
                            default:
                                console.log("TOKEN NAME IS NOT APPLY");
                                tokenName = "NOT APPLY";
                                break;
                        }
                        console.log(`Transaction Token Value: ${web3.utils.fromWei(tokenValue.toString(), 'ether')}` + ` ${tokenName}`)
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