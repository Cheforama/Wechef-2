import Web3 from "web3";
import { nft_address } from "../../contracts/contract";
import nftAbi from '../../contracts/abi/NFT.sol/NFT.json'

export const getContract = () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const contract = new web3.eth.Contract(nftAbi.abi, nft_address);
    return contract;
}