pragma solidity ^0.8.13;

import "forge-std/Test.sol";

contract ModicumMockTest is Test {
    uint256[] public currentJobs;
    mapping(uint256 => string) jobParams;

    function getCurrentJobs() public view returns (uint256[] memory) {
        return currentJobs;
    }

    function clearJobIds() public {
        uint256 numKeys = currentJobs.length;
        for (uint256 i = 0; i < numKeys; i++) {
            delete jobParams[i];
        }
        numKeys = 0;
        delete currentJobs;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getParams(uint256 jobId) public view returns (string memory) {
        return jobParams[jobId];
    }

    function runModuleWithDefaultMediators(
        string calldata name,
        string calldata params
    ) external payable returns (uint256) {
        // use sha256 to also generate a uint256 number
        uint256 currentJobId = getJobId(name, params, currentJobs.length);
        jobParams[currentJobId] = params;
        currentJobs.push(currentJobId);
        return currentJobId;
    }

    function getJobId(
        string calldata name,
        string calldata params,
        uint256 jobNo
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(name, params, jobNo)));
    }
}
