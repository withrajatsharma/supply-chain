import web3 from './web3';
import SupplyChain from '../../build/contracts/SupplyChain.json';


const contractAddress = '0x7f435B1aA08599007C23Ea9711fc297EEb14cD84'; // Address of deployed contract
const instance = new web3.eth.Contract(
  SupplyChain.abi,
  contractAddress
);

export default instance;
