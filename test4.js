import Web3 from "web3";
import erc20Abi from "./erc20.abi.json" assert { type: "json" };
import kafka from "kafka-node";

const web3 = new Web3('https://mainnet.bitonechain.com/');

class TxOfBlock {
    constructor(transactionHash, blockNumber, fromAddr, toAddr, tokenVolume, coinVolume, gasPrice, tokenContractAddr, timeStamp) {
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.tokenVolume = tokenVolume;
        this.coinVolume = coinVolume;
        this.gasPrice = gasPrice;
        this.tokenContractAddr = tokenContractAddr;
        this.timeStamp = timeStamp;
    }
}

function getTimeStamp(date){
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month; // 10이 넘지 않으면 앞에 0을 붙인다
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day; // 10이 넘지 않으면 앞에 0을 붙인다
    var hours = date.getHours();
    hours = hours >= 10 ? hours : '0' + hours; // 10이 넘지 않으면 앞에 0을 붙인다
    var minutes = date.getMinutes();
    minutes =  minutes >= 10 ? minutes : '0' + minutes; // 10이 넘지 않으면 앞에 0을 붙인다
    var seconds = date.getSeconds();
    seconds = seconds >= 10 ? seconds : '0' + seconds; // 10이 넘지 않으면 앞에 0을 붙인다
 
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

let lastBlockNum = "";
async function getBlockInfo() {
    try {
        const blockNumber = await web3.eth.getBlockNumber(); // 최신 블록 번호 가져오기
        const timeStamp = getTimeStamp(new Date());
        if(blockNumber != lastBlockNum) {
            lastBlockNum = blockNumber;
            const block = await web3.eth.getBlock(blockNumber, true); // 최신 블록 정보 가져오기 (with transactions)
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ NEW BLOCK GENERATE START @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            let txBioInfo = new TxOfBlock();
            txBioInfo.blockNumber = blockNumber; 
            txBioInfo.timeStamp = timeStamp;
            if(block.transactions.length == 0) {
                console.log("BLOCK IS EMPTY. THERE IS NO TRANSACTION");
                console.log(txBioInfo);
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ NEW BLOCK GENERATE FINISH @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                return;
            }
            console.log('Transactions in latest block:');
            block.transactions.forEach(async (tx, index) => {
                const txRecipt = await web3.eth.getTransactionReceipt(tx.hash)
                if(txRecipt.logs.length != 0) {
                    console.log("------------------------- TRANSACTION RECEIPT START(TOKEN TRANSFER) -------------------------");
                    const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                    const tokenValue = web3.utils.hexToNumberString(txRecipt.logs[0].data);
                    const tokenContract = txRecipt.logs[0].address;
                    txBioInfo.transactionHash = tx.hash;
                    txBioInfo.fromAddr = tx.from;
                    txBioInfo.toAddr = tx.to;
                    txBioInfo.gasPrice = web3.utils.fromWei(gasFee.toString(), 'ether');
                    txBioInfo.tokenContractAddr = tokenContract;
                    txBioInfo.tokenVolume =  tokenValue / (10**18);
                    const client = new kafka.KafkaClient({ kafkaHost: '59.10.9.149:9092' });
                    const producer = new kafka.Producer(client);
                    console.log(txBioInfo);
                    console.log("------------------------- TRANSACTION RECEIPT FINISH(TOKEN TRANSFER) --------------------------");
                } else {
                    console.log("****************************** TRANSACTION RECEIPT START(COIN TRANSFER) ******************************");
                    const gasFee = (txRecipt.effectiveGasPrice * txRecipt.gasUsed);
                    txBioInfo.blockNumber = txRecipt.blockNumber;
                    txBioInfo.timeStamp = timeStamp;
                    txBioInfo.transactionHash = tx.hash;
                    txBioInfo.fromAddr = tx.from;
                    txBioInfo.toAddr = tx.to;
                    txBioInfo.gasPrice = web3.utils.fromWei(gasFee.toString(), 'ether');
                    txBioInfo.tokenContractAddr = "ETH";
                    txBioInfo.coinVolume = web3.utils.fromWei(tx.value.toString(), 'ether');                
                    console.log(txBioInfo);
                    console.log("****************************** TRANSACTION RECEIPT FINISH(COIN TRANSFER) ******************************");
                }
                if (index == block.transactions.length -1 || block.transactions.length == 0) {
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ NEW BLOCK GENERATE FINISH @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                }
            })
        }
    } catch (error) {
      console.error(error);
    }
}

getBlockInfo();
setInterval(getBlockInfo, 2000);