/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ModicumContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ModicumContract__factory>;
    getContractFactory(
      name: "TinyHops",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TinyHops__factory>;

    getContractAt(
      name: "ModicumContract",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ModicumContract>;
    getContractAt(
      name: "TinyHops",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TinyHops>;

    deployContract(
      name: "ModicumContract",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ModicumContract>;
    deployContract(
      name: "TinyHops",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TinyHops>;

    deployContract(
      name: "ModicumContract",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ModicumContract>;
    deployContract(
      name: "TinyHops",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TinyHops>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
