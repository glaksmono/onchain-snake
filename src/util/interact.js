require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const contractABI = require("../contract-abi.json");
const contractAddress = "0x5007Cf9AE23b9945426B8f6138b200439D418adE";

const myAddress = '0x7F8a300D121711034f09327BCdDE08DFa61cE54E'

export const web3 = createAlchemyWeb3(alchemyKey);
export const privateKey = process.env.REACT_APP_PRIVATE_KEY;
export const snakeContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const loadLatestPosition = async () => { 
    const position = await snakeContract.methods.getAppleLocation().call();
    return position;
};

export const updatePosition = async (x, y, dx, dy, cells) => {
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0

    const transaction = {
        'to': '0x7a55f1544d7387E97596F8ebe604a0BfB9b33f37', // faucet address to return eth
        // 'value': 100000000000000000, // 1 ETH
        'gas': 30000, 
        'nonce': nonce,
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}