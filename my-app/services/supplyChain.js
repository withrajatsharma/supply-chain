import web3 from './web3';
import SupplyChain from '../../build/contracts/SupplyChain.json';


const contractAddress = '0xc1D97d5d32F5f455156a0f6a1ddcc4140515812F';
const instance = new web3.eth.Contract(
  SupplyChain.abi,
  contractAddress
);

export default instance;
