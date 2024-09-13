import web3 from './web3';
import SupplyChain from '../../build/contracts/SupplyChain.json';


const contractAddress = '0x779C7B1Aafbed0451E9CFF2a0dcb23b705D35E30'; // Address of deployed contract
const instance = new web3.eth.Contract(
  SupplyChain.abi,
  contractAddress
);

export default instance;
