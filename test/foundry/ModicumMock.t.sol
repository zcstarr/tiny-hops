// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

contract ModicumMockTest is Test {
    uint256 public currentJob;

    function clearJobIds() public {
        currentJob = 0;
    }

    function runModuleWithDefaultMediators(
        string calldata name,
        string calldata params
    ) external payable returns (uint256) {
        // use sha256 to also generate a uint256 number
        return getJobId(name, params, ++currentJob);
    }

    function getJobId(
        string calldata name,
        string calldata params,
        uint256 jobNo
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(name, params, jobNo)));
    }
}
