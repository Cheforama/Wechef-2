import Web3 from "web3";
import { market_address, token_address } from "../../contracts/contract";
import marketAbi from '../../contracts/abi/Marketplace.sol/NFTMarketplace.json'
import tokenAbi from '../../contracts/abi/ChefToken.sol/ChefToken.json';

export const getMarketContract = () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const contract = new web3.eth.Contract(marketAbi.abi, market_address);
    return contract;
}

export const getTokenContract = () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const token_contract = new web3.eth.Contract(tokenAbi.abi, token_address);
    return token_contract;
}