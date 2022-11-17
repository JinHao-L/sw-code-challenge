import { BigNumber, ContractInterface, ethers } from "ethers";

const SWTH_ADDR: string = "0xc0ecb8499d8da2771abcbf4091db7f65158f1468";
const ABI: ContractInterface = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

// some wallet address to check
const TARGETS: string[] = [
  "0xb5d4f343412dc8efb6ff599d790074d0f1e8d430",
  "0x0020c5222a24e4a96b720c06b803fb8d34adc0af",
  "0xd1d8b2aae2ebb2acf013b803bc3c24ca1303a392",
];

// you can use your own RPC provider url (no need to deploy to mainnet)
const bscProvider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/",
  { name: "binance", chainId: 56 }
);
const contract = new ethers.Contract(SWTH_ADDR, ABI, bscProvider);

const promises: Promise<BigNumber>[] = TARGETS.map((addr) =>
  contract.balanceOf(addr)
);
Promise.all(promises).then((arr) =>
  arr.forEach((output, index) => {
    console.log(TARGETS[index], output.toNumber());
  })
);
