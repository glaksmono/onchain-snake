require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x5007Cf9AE23b9945426B8f6138b200439D418adE";

export const snakeContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const loadLatestPosition = async () => { 
    const position = await snakeContract.methods.getAppleLocation().call();
    return position;
};