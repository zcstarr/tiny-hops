// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.6;
import "forge-std/console.sol";
import "./library/LibTinyHopsTemplateResolver.sol";

uint256 constant WORKFLOW_STATUS_NOT_STARTED = 0;
uint256 constant WORKFLOW_STATUS_STARTED = 1;
uint256 constant WORKFLOW_STATUS_PAUSED = 2;
uint256 constant WORKFLOW_STATUS_COMPLETED = 3;
uint256 constant WORKFLOW_STATUS_FAILED = 4;

uint256 constant STEP_STATUS_NOT_STARTED = 0;
uint256 constant STEP_STATUS_STARTED = 1;
uint256 constant STEP_STATUS_PAUSED = 2;
uint256 constant STEP_STATUS_COMPLETED = 3;

// give it the ModicumContract interface
// NB: this will be a separate import in future.
interface ModicumContract {
    function runModuleWithDefaultMediators(
        string calldata name,
        string calldata params
    ) external payable returns (uint256);
}

struct WorkflowEntry {
    uint256 cost;
    uint256 stepId;
    string cmd;
    bytes params;
    uint256[] deps;
}

struct Workflow {
    WorkflowEntry[][] entries;
}

contract TinyHops {
    address public contractAddress;
    ModicumContract remoteContractInstance;

    // simple ownership mapping
    mapping(uint256 => address) workflowIdToOwner;
    // status of the workflow
    // 0 - not started
    // 1 - started
    // 2 - paused
    // 3 - completed
    // 4 - failed
    mapping(uint256 => uint256) workflowIdToStatus;
    mapping(uint256 => Workflow) workflowIdToWorkflow;
    mapping(uint256 => uint256) workflowIdToBalance;
    mapping(uint256 => uint256) workflowIdToJobId;
    mapping(uint256 => uint256) jobIdToWorkflowId;
    // entry is a sha256 hash of the workflowId and stepId resulting in a single tiered lookup
    mapping(bytes32 => string) workflowStepHashToCid;

    mapping(uint256 => uint256[2]) jobIdToStepIndex;
    mapping(uint256 => uint256) jobIdToStepId;

    mapping(uint256 => mapping(uint256 => string)) workflowIdToResultCid;

    // This takes a sha256 hash of the job_id and the step_index to mark the step as received completed
    //3 is failed  2 is complete 1 is pending 0 is not complete

    mapping(bytes32 => uint256) stepHashToStepStatus;
    mapping(bytes32 => string) stepHashToStepResult;
    // the job id tracks the iteration in the workflow entries
    // this is the counter to track your position in the workflow,
    // if you have to pause to reset or resume this will track your position
    // and start executing from there again
    mapping(uint256 => uint256) jobIdToWorkflowCounter;

    // auto increment workflow id
    uint256 public workflowIdCounter;

    // See the latest result.

    uint256 public resultJobId1;
    uint256 public resultJobId2;

    string public resultCIDs1;
    string public resultCIDs2;

    uint256 public job1;
    uint256 public job2;

    event WorkflowAdded(uint256 workflowId, address owner);
    event WorkflowStartedJob(
        uint256 workflowId,
        uint256 jobId,
        uint256 balance
    );

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

    function increaseWorkflowIdCounter() internal returns (uint256) {
        workflowIdCounter++;
        return workflowIdCounter;
    }

    function ownerOf(uint256 workflowId) public view returns (address) {
        return workflowIdToOwner[workflowId];
    }

    function setWorkFlowStatus(
        uint256 workflowId,
        uint256 status
    ) internal returns (uint256) {
        workflowIdToStatus[workflowId] = status;
        return workflowIdToStatus[workflowId];
    }

    function getWorkFlowStatus(
        uint256 workflowId
    ) public view returns (uint256) {
        return workflowIdToStatus[workflowId];
    }

    function storeWorkflow(Workflow memory workflow) public returns (uint256) {
        uint256 workflowId = increaseWorkflowIdCounter();

        // Get a storage reference to the new workflow
        Workflow storage newWorkflow = workflowIdToWorkflow[workflowId];

        // Iterate through the outer array
        for (uint256 i = 0; i < workflow.entries.length; i++) {
            newWorkflow.entries.push(); // Create a new inner array in storage
            WorkflowEntry[] storage entriesStorage = newWorkflow.entries[
                newWorkflow.entries.length - 1
            ];

            // Iterate through the inner array
            for (uint256 j = 0; j < workflow.entries[i].length; j++) {
                WorkflowEntry memory entryMem = workflow.entries[i][j];

                // Create a new entry in storage
                entriesStorage.push();
                WorkflowEntry storage entryStorage = entriesStorage[
                    entriesStorage.length - 1
                ];

                // Copy data from memory to storage
                entryStorage.stepId = entryMem.stepId;
                entryStorage.cmd = entryMem.cmd;
                entryStorage.params = entryMem.params;
                entryStorage.cost = entryMem.cost;

                // Copy deps array from memory to storage
                /*for (uint256 k = 0; k < entryMem.deps.length; k++) {
                    entryStorage.deps.push(entryMem.deps[k]);
                }*/
            }
        }
        workflowIdToOwner[workflowIdCounter] = msg.sender;

        return workflowId;
    }

    modifier isWorkflowOwner(uint256 workflowId) {
        require(
            msg.sender == workflowIdToOwner[workflowId],
            "Only the owner can call this function"
        );
        _;
    }

    function creditBalance(uint256 workflowId, uint256 amount) internal {
        workflowIdToBalance[workflowId] =
            workflowIdToBalance[workflowId] +
            amount;
    }

    function startWorkflow(
        uint256 workflowId
    ) public payable isWorkflowOwner(workflowId) returns (uint256) {
        require(
            msg.value >= 5 ether,
            "Payment of at least 5 Ether per step is required maybe more"
        );

        // Allocate storage for the new workflow
        // Workflow storage workflow = workflowIdToWorkflow[workflowId];
        require(
            workflowIdToStatus[workflowId] == 0,
            "Workflow already started"
        );
        creditBalance(workflowId, msg.value);
        executeNextStep(workflowId, getNextStep(workflowId));

        /*for (uint256 i = 0; i < workflow.entries[0].length; i++) {
            /* require(workflow.entries[0][0].cost > 0, "cost is zero");
            require(
                workflow.entries[0][0].cost <= workflowIdToBalance[workflowId],
                "not enough funds"
            
            // set the balance less the cost of running
            workflowIdToBalance[workflowId] =
                workflowIdToBalance[workflowId] -
                workflow.entries[0][i].cost;

            uint256 jobId = remoteContractInstance
                .runModuleWithDefaultMediators{
                value: workflow.entries[0][i].cost
            }(workflow.entries[0][i].cmd, workflow.entries[0][i].params);

            jobIdToWorkflowId[jobId] = workflowId;
            jobIdToStepIndex[jobId][0] = 0;
            jobIdToStepIndex[jobId][1] = i;
            jobIdToWorkflowCounter[jobId] = 0;
            // kick off the first workflow steps
            emit WorkflowStartedJob(
                workflowId,
                jobId,
                workflowIdToBalance[workflowIdCounter]
            );
            */
        workflowIdToStatus[workflowId] = 1;

        return workflowId;
    }

    /*
     * @notice Run the SDXL Module
     * @param prompt The input text prompt to generate the stable diffusion image from
    function runSDXL(string memory prompt) public payable returns (uint256) {
        //require(msg.value == 2 ether, "Payment of 2 Ether is required"); //all jobs are currently 2 lilETH
        return
            remoteContractInstance.runModuleWithDefaultMediators{
                value: msg.value
            }("sdxl:v0.9-lilypad1", prompt);
    }*/
    function getWorkHash(
        uint256 _workflowId,
        uint256 _stepId
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_workflowId, _stepId));
    }

    function _getStepIndices(
        uint256 _jobId
    ) internal returns (uint256[2] memory) {
        uint256 workflowId = jobIdToWorkflowId[_jobId];
        uint256 lastKnownWorkflowIndex = jobIdToWorkflowCounter[_jobId];
        uint256 workflowIndex = jobIdToStepIndex[_jobId][0];
        uint256 stepIndex = jobIdToStepIndex[_jobId][1];
        return [workflowIndex, stepIndex];
    }

    function _updateStepStatus(
        uint256 _jobId,
        string calldata _cid,
        uint256 _status
    ) internal returns (uint256) {
        // bytes32 workHash = getWorkHash(_jobId, _workflowIndex, _stepId);
        uint256 workflowId = jobIdToWorkflowId[_jobId];
        uint256 _stepId = jobIdToStepId[_jobId];
        bytes32 workHash = getWorkHash(workflowId, _stepId);
        stepHashToStepStatus[workHash] = _status;
        stepHashToStepResult[workHash] = _cid;
        workflowIdToResultCid[workflowId][_stepId] = _cid;
        return workflowId;
    }

    function updateBalance(uint256 workflowId, uint256 cost) internal {
        require(
            workflowIdToBalance[workflowId] >= cost,
            "not enough funds to run"
        );
        workflowIdToBalance[workflowId] =
            workflowIdToBalance[workflowId] -
            cost;
    }

    function getBalance(uint256 workflowId) public view returns (uint256) {
        return workflowIdToBalance[workflowId];
    }

    function getNextStep(uint256 workflowId) internal view returns (uint256) {
        Workflow storage workflow = workflowIdToWorkflow[workflowId];
        uint256 numEntries = workflow.entries.length;
        for (uint256 i = 0; i < numEntries; i++) {
            bool isCompleted = true;
            uint256 numSubEntries = workflow.entries[i].length;
            for (uint256 j = 0; j < numSubEntries; j++) {
                bytes32 workHash = getWorkHash(
                    workflowId,
                    workflow.entries[i][j].stepId
                );
                if (stepHashToStepStatus[workHash] == 0) {
                    isCompleted = false;
                    break;
                }
            }
            if (!isCompleted) {
                return i;
            }
        }
        return numEntries;
    }

    function executeNextStep(
        uint256 workflowId,
        uint256 workflowIndex
    ) internal {
        Workflow storage workflow = workflowIdToWorkflow[workflowId];

        uint256 numEntries = workflow.entries[workflowIndex].length;
        for (uint256 i = 0; i < numEntries; i = i + 1) {
            // This will also throw on underflow must have non zero balance at all times
            updateBalance(workflowId, workflow.entries[workflowIndex][i].cost);

            uint256 jobId = remoteContractInstance
                .runModuleWithDefaultMediators{
                value: workflow.entries[workflowIndex][i].cost
            }(
                workflow.entries[workflowIndex][i].cmd,
                LibTinyHopsTemplateResolver.applyVariables(
                    workflow.entries[workflowIndex][i].params,
                    workflowIdToResultCid[workflowId]
                )
            );
            jobIdToWorkflowId[jobId] = workflowId;
            jobIdToStepId[jobId] = workflow.entries[workflowIndex][i].stepId;
            stepHashToStepStatus[
                getWorkHash(
                    workflowId,
                    workflow.entries[workflowIndex][i].stepId
                )
            ] = STEP_STATUS_STARTED;
            // jobIdToStepIndex[jobId][0] = workflowIndex;
            // jobIdToStepIndex[jobId][1] = i;
            jobIdToWorkflowCounter[jobId] = workflowIndex;
            emit WorkflowStartedJob(
                workflowId,
                jobId,
                workflowIdToBalance[workflowIdCounter]
            );
        }
        return;
    }

    function getEntryParam(
        uint256 workflowId,
        WorkflowEntry memory entry
    ) internal view returns (string memory) {
        return
            LibTinyHopsTemplateResolver.applyVariables(
                entry.params,
                workflowIdToResultCid[workflowId]
            );
    }

    function getWorkFlowResults(
        uint256 workflowId
    )
        public
        view
        returns (uint256[] memory, string[] memory, string[] memory params)
    {
        Workflow storage workflow = workflowIdToWorkflow[workflowId];
        uint256 numEntries = 0;
        for (uint256 i = 0; i < workflow.entries.length; i++) {
            numEntries += workflow.entries[i].length;
        }
        uint256[] memory stepIds = new uint256[](numEntries);
        string[] memory cids = new string[](numEntries);
        string[] memory params = new string[](numEntries);

        uint256 index = 0;
        for (uint256 i = 0; i < workflow.entries.length; i++) {
            for (uint256 j = 0; j < workflow.entries[i].length; j++) {
                stepIds[index] = workflow.entries[i][j].stepId;
                cids[index] = stepHashToStepResult[
                    getWorkHash(workflowId, workflow.entries[i][j].stepId)
                ];
                params[index] = getEntryParam(
                    workflowId,
                    workflow.entries[i][j]
                );
                index++;
            }
        }

        return (stepIds, cids, params);
    }

    function getStepStatus(
        uint256 workflowId,
        uint256 stepId
    ) public view returns (uint256) {
        bytes32 workHash = getWorkHash(workflowId, stepId);
        return stepHashToStepStatus[workHash];
    }

    function checkAllEntryStepsComplete(
        uint256 _workflowId
    ) public view returns (bool) {
        Workflow storage workflow = workflowIdToWorkflow[_workflowId];
        for (uint256 i = 0; i < workflow.entries.length; i++) {
            for (uint256 j = 0; j < workflow.entries[i].length; j++) {
                bytes32 workHash = getWorkHash(
                    _workflowId,
                    workflow.entries[i][j].stepId
                );
                if (stepHashToStepStatus[workHash] != STEP_STATUS_COMPLETED) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkPreviousLevelComplete(
        uint256 workflowID,
        uint256 workflowIndex
    ) public returns (bool) {
        uint256 prevWorkflowIndex;
        if (workflowIndex != 0) {
            prevWorkflowIndex = workflowIndex - 1;
        }
        Workflow storage workflow = workflowIdToWorkflow[workflowID];
        if (prevWorkflowIndex >= workflow.entries.length) {
            // If the previous workflow index is out of bounds, then we can assume it's not complete
            return false;
        }
        uint256 numEntries = workflow.entries[prevWorkflowIndex].length;
        for (uint256 i = 0; i < numEntries; i++) {
            bytes32 workHash = getWorkHash(
                workflowID,
                workflow.entries[prevWorkflowIndex][i].stepId
            );
            if (stepHashToStepStatus[workHash] != STEP_STATUS_COMPLETED) {
                return false;
            }
        }
        return true;
    }

    // This must be implemented in order to receive the job results back!
    function receiveJobResults(uint256 _jobID, string calldata _cid) public {
        uint256 workflowId = _updateStepStatus(
            _jobID,
            _cid,
            STEP_STATUS_COMPLETED
        );
        if (checkAllEntryStepsComplete(workflowId)) {
            setWorkFlowStatus(workflowId, WORKFLOW_STATUS_COMPLETED);
            return;
        }
        uint256 workflowIndex = getNextStep(workflowId);
        if (checkPreviousLevelComplete(workflowId, workflowIndex)) {
            // returns last operating cache for the list
            executeNextStep(workflowId, workflowIndex);
        }
        // should update the status and store the result
        /*   (uint256 workflowID, uint256 workflowIndex) = _updateStepStatus(
            jobID,
            _cid
        );
        // uint256[2] memory stepIndices = _getStepIndices(_jobID);
        //  _updateStepStatus(_jobID, stepIndices[0], stepIndices[1], STEP_STATUS_COMPLETED);
        if (checkAllEntryStepsComplete(workflowID, workflowIndex)) {
            workflowIndex = increaseWorkflowCounter(workflowId);
        }
        if (checkMoreWork(workflowID, workflowIndex)) {
            // workflowIndex ++;
            executeNextStep(workflowID, workflowIndex);
        } else {
            setWorkflowStatus(workflowID, WORKFLOW_STATUS_COMPLETED);
        } *
    }
    /*        if (_jobID == job1) {
            resultJobId1 = _jobID;
            resultCIDs1 = _cid;
        }
        if (_jobID == job2) {
            resultJobId2 = _jobID;
            resultCIDs2 = _cid;
        }
    } */
    }
}
