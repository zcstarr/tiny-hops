// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.6;

// give it the ModicumContract interface
// NB: this will be a separate import in future.
interface ModicumContract {
    function runModuleWithDefaultMediators(
        string calldata name,
        string calldata params
    ) external payable returns (uint256);
}

contract TinyHops {
    address public contractAddress;
    ModicumContract remoteContractInstance;

    // See the latest result.

    uint256 public resultJobId1;
    uint256 public resultJobId2;

    string public resultCIDs1;
    string public resultCIDs2;

    uint256 public job1;
    uint256 public job2;

    // The Modicum contract address is found here: https://github.com/bacalhau-project/lilypad-modicum/blob/main/latest.txt
    // Current: 0x422F325AA109A3038BDCb7B03Dd0331A4aC2cD1a
    constructor(address _modicumContract) {
        require(
            _modicumContract != address(0),
            "Contract cannot be zero address"
        );
        contractAddress = _modicumContract;
        //make a connection instance to the remote contract
        remoteContractInstance = ModicumContract(_modicumContract);
    }

    function runBatchSDXL(
        string memory prompt1,
        string memory prompt2
    ) public payable {
        job1 = remoteContractInstance.runModuleWithDefaultMediators{
            value: msg.value / 2
        }("sdxl:v0.9-lilypad1", prompt1);
        job2 = remoteContractInstance.runModuleWithDefaultMediators{
            value: msg.value / 2
        }("sdxl:v0.9-lilypad1", prompt2);
    }

    /*
     * @notice Run the SDXL Module
     * @param prompt The input text prompt to generate the stable diffusion image from
     */
    function runSDXL(string memory prompt) public payable returns (uint256) {
        //require(msg.value == 2 ether, "Payment of 2 Ether is required"); //all jobs are currently 2 lilETH
        return
            remoteContractInstance.runModuleWithDefaultMediators{
                value: msg.value
            }("sdxl:v0.9-lilypad1", prompt);
    }

    // This must be implemented in order to receive the job results back!
    function receiveJobResults(uint256 _jobID, string calldata _cid) public {
        if (_jobID == job1) {
            resultJobId1 = _jobID;
            resultCIDs1 = _cid;
        }
        if (_jobID == job2) {
            resultJobId2 = _jobID;
            resultCIDs2 = _cid;
        }
    }
}
