// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global ethers task */
// require('@nomiclabs/hardhat-waffle');
// require("@nomiclabs/hardhat-ethers");
// require('@nomiclabs/hardhat-etherscan');

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-foundry";

import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PRIV_KEY =
  process.env.PRIV_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const MUMBAI_ALCHEMY_ENDPOINT = process.env.MUMBAI_ALCHEMY_ENDPOINT || "";
const ARB_GOERLI_ALCHEMY_ENDPOINT =
  process.env.ARB_GOERLI_ALCHEMY_ENDPOINT || "";
const POLYGON_ALCHEMY_ENDPOINT = process.env.POLYGON_ALCHEMY_ENDPOINT || "";
function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean) // remove empty lines
    .map((line) => line.trim().split("="));
}

const config: HardhatUserConfig = {
  /*preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          for (const [from, to] of getRemappings()) {
            if (line.includes(from)) {
              line = line.replace(from, to);
              break;
            }
          }
        }
        return line;
      }
    })
  },*/
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  gasReporter: {
    enabled: true,
    outputFile: "./gasReporter.txt"
  },
  etherscan: {
    apiKey: "GF5RBQ6R19VFK7RYSNSCEHZHDUTEFRVVR9"
  },
  defaultNetwork: "hardhat",
  typechain: {
    target: "ethers-v6",
    outDir: "src/generated/typechain-types"
  },
  paths: {
    artifacts: "./src/artifacts",
    sources: "./contracts",
    tests: "./contracts/test"
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockGasLimit: 9999335000000,
      gas: "auto"
    },
    localhost: {
      timeout: 9999000,
      blockGasLimit: 9999335000000,
      url: "http://127.0.0.1:8545",
      accounts: [PRIV_KEY],
      chainId: 31337
    },
    lilypad: {
      url:"http://testnet.lilypadnetwork.org:8545",
      gas: "auto",
      accounts: [PRIV_KEY],
      chainId: 1337
    },
    lilypad2: {
        url: "http://testnetv2.arewehotshityet.com:8545",
        gas: "auto",
        accounts: [PRIV_KEY],
        chainId: 1337
    }
    
  }
};

export default config;