import { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";

// Plugins
import "@nomicfoundation/hardhat-toolbox"; 
import "@typechain/hardhat"
import "@fhevm/hardhat-plugin";
import "hardhat-deploy";           
import "hardhat-gas-reporter";
import "solidity-coverage";



// Custom tasks
import "./tasks/accounts";
import "./tasks/FHECounter";

const MNEMONIC: string = vars.get("MNEMONIC");
const ALCHEMY_API_KEY: string = vars.get("ALCHEMY_API_KEY");

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: { deployer: 0 },
  etherscan: { apiKey: { sepolia: vars.get("ETHERSCAN_API_KEY", "") } },
  gasReporter: { currency: "USD", enabled: process.env.REPORT_GAS ? true : false, excludeContracts: [] },
  networks: {
    hardhat: { accounts: { mnemonic: MNEMONIC }, chainId: 31337 },
    anvil: { accounts: { mnemonic: MNEMONIC, path: "m/44'/60'/0'/0/", count: 10 }, chainId: 31337, url: "http://localhost:8545" },
    sepolia: { accounts: { mnemonic: MNEMONIC, path: "m/44'/60'/0'/0/", count: 10 }, chainId: 11155111, url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}` }
  },
  paths: { artifacts: "./artifacts", cache: "./cache", sources: "./contracts", tests: "./test" },
  solidity: {
    version: "0.8.27",
    settings: { metadata: { bytecodeHash: "none" }, optimizer: { enabled: true, runs: 800 }, evmVersion: "cancun" }
  },
  typechain: { outDir: "typechain-types", target: "ethers-v6" },
};

export default config;
