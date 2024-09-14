import web3 from './web3';
import SupplyChain from '../../build/contracts/SupplyChain.json';


const contractAddress = '0x02D47FccC2478140DDa3Ac3006607311D522aaaC'; // Address of deployed contract
const instance = new web3.eth.Contract(
  SupplyChain.abi,
  contractAddress
);

export default instance;
