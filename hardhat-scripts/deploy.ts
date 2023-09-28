/* eslint prefer-const: "off" */

import "@nomicfoundation/hardhat-ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  const tinyHops = ethers.getContractFactory("TinyHops");
  const customModicum = ethers.getContractFactory("CustomModicum");
  const contract = await ethers.deployContract("CustomModicum", { });
  await contract.waitForDeployment();
  console.log("the addr", contract.target);
  const tinyHopsContract = await ethers.deployContract("TinyHops", [contract.target]);
  await tinyHopsContract.waitForDeployment();
  console.log("tiny hops addr", tinyHopsContract.target);
}
main()