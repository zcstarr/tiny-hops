// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./ModicumMock.t.sol";
import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../../contracts/TinyHops.sol";
import "../../contracts/library/LibTinyHopsTemplateResolver.sol";

contract TinyHopsTest is Test {
    TinyHops public tinyHops;
    ModicumMockTest public modicumMock;
    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");
    address modicumNode = makeAddr("modicumNode");
    mapping(uint256 => string) replacements;

    function setUp() public {
        modicumMock = new ModicumMockTest();
        tinyHops = new TinyHops(address(modicumMock));
    }

    function buildWorkflowParamVar(
        uint64 stepId
    ) public view returns (bytes memory) {
        return abi.encodePacked(uint16(1), uint64(stepId));
    }

    function buildWorkflowParamText(
        string memory text
    ) public view returns (bytes memory) {
        return
            abi.encodePacked(
                uint16(0),
                uint64(bytes(text).length),
                bytes(text)
            );
    }

    function testStreamHex() public view {
        bytes memory hello = buildWorkflowParamText("hello world ");
        bytes memory stepId1 = buildWorkflowParamVar(1);

        bytes memory testStream = abi.encodePacked(hello, stepId1);
        console.logBytes(testStream);
    }

    function getTestStream() public view returns (bytes memory testStream) {
        bytes memory hello = buildWorkflowParamText("hello ");
        bytes memory world = buildWorkflowParamText(" world ");
        bytes memory stepId0 = buildWorkflowParamVar(0);
        bytes memory stepId1 = buildWorkflowParamVar(1);

        testStream = abi.encodePacked(hello, stepId0, world, stepId1);
    }

    function testValidateWorkflow() public {
        bytes memory testStream = getTestStream();
        LibTinyHopsTemplateResolver.validateByteStream(testStream);

        replacements[0] = "QmNjJUyFZpSg7HC9akujZ6KHWvJbCEytre3NRSMHzCA6NR";
        replacements[1] = "QmNjJUyFZpSg7HC9akujZ6KHWvJbCEytre3NRSMHzCA6N1";
        string memory resolved = LibTinyHopsTemplateResolver.applyVariables(
            testStream,
            replacements
        );
        console.log("resolved", resolved);
        assertEq(
            resolved,
            "hello QmNjJUyFZpSg7HC9akujZ6KHWvJbCEytre3NRSMHzCA6NR world QmNjJUyFZpSg7HC9akujZ6KHWvJbCEytre3NRSMHzCA6N1"
        );
    }

    function testSingleJob() public {
        vm.deal(user1, 10 ether);
        vm.startPrank(user1);
        Workflow memory workflow;
        workflow.entries = new WorkflowEntry[][](1);
        workflow.entries[0] = new WorkflowEntry[](1);
        // generate a workflow Entry
        workflow.entries[0][0] = WorkflowEntry(
            5 ether,
            0,
            "cowsay:v0.0.1",
            buildWorkflowParamText("hello world")
        );
        uint256 workflowId = tinyHops.storeWorkflow(workflow);
        assertEq(workflowId, 1);
        assertEq(user1, tinyHops.ownerOf(workflowId));
        tinyHops.startWorkflow{value: 5 ether}(workflowId);
        assertEq(
            WORKFLOW_STATUS_STARTED,
            tinyHops.getWorkFlowStatus(workflowId)
        );
        vm.stopPrank();
        vm.startPrank(address(modicumMock));
        uint256[] memory currentJobs = modicumMock.getCurrentJobs();
        assertEq(tinyHops.getStepStatus(workflowId, 0), STEP_STATUS_STARTED);
        assertEq(currentJobs.length, 1);
        assertEq(modicumMock.getParams(currentJobs[0]), "hello world");
        tinyHops.receiveJobResults(currentJobs[0], "fake cid");
        assertEq(tinyHops.getStepStatus(workflowId, 0), STEP_STATUS_COMPLETED);
        (
            uint256[] memory stepIds,
            string[] memory cids,
            string[] memory params
        ) = tinyHops.getWorkFlowResults(workflowId);
        assertEq(stepIds[0], 0);
        assertEq(cids[0], "fake cid");
        assertEq(
            tinyHops.getWorkFlowStatus(workflowId),
            WORKFLOW_STATUS_COMPLETED
        );
        // uint256 workflowId = tinyHops.startWorkflow(workflow);
        // tinyHops.getWorkflow(workflowId);
    }

    // Parallel Job test shoudl work we also permuted the order of the jobs,
    // so out of order execution should work as well async comms and all

    /*
        This job will have 3 steps a starting job
        two parallel jobs
        and a final job that aggregates thte results of the parallel job
        each job will feed the results into the next job, the final job will also
        take results of the first job in into account as well in it's parameter
        demonstrating the ability to process a complex DAG graph workflow



    */

    function testFanOutInJob() public {
        vm.deal(user1, 40 ether);
        vm.startPrank(user1);
        Workflow memory workflow;
        workflow.entries = new WorkflowEntry[][](3);
        workflow.entries[0] = new WorkflowEntry[](1);
        workflow.entries[1] = new WorkflowEntry[](2);
        workflow.entries[2] = new WorkflowEntry[](1);
        // generate a workflow Entry
        workflow.entries[0][0] = WorkflowEntry(
            5 ether,
            0,
            "cowsay:v0.0.1",
            buildWorkflowParamText("hello world l0")
        );

        workflow.entries[1][0] = WorkflowEntry(
            5 ether,
            1,
            "cowsay:v0.0.1",
            //"hello world l1(0,0) {{stepId: 0}}",
            abi.encodePacked(
                buildWorkflowParamText("hello world l1(0,0) "),
                buildWorkflowParamVar(0)
            )
        );

        workflow.entries[1][1] = WorkflowEntry(
            5 ether,
            2,
            "cowsay:v0.0.1",
            //"hello world l1(0,1) {{stepId: 0}}",
            abi.encodePacked(
                buildWorkflowParamText("hello world l1(0,1) "),
                buildWorkflowParamVar(0)
            )
        );

        workflow.entries[2][0] = WorkflowEntry(
            5 ether,
            3,
            "cowsay:v0.0.1",
            //"{{stepId: 0}} hello world {{stepId: 1}} l2(0,0) {{stepId: 2}}",
            abi.encodePacked(
                buildWorkflowParamVar(0),
                buildWorkflowParamText(" hello world "),
                buildWorkflowParamVar(1),
                buildWorkflowParamText(" l2(0,0) "),
                buildWorkflowParamVar(2)
            )
        );
        uint256 workflowId = tinyHops.storeWorkflow(workflow);
        assertEq(workflowId, 1);
        assertEq(user1, tinyHops.ownerOf(workflowId));
        tinyHops.startWorkflow{value: 30 ether}(workflowId);
        assertEq(
            WORKFLOW_STATUS_STARTED,
            tinyHops.getWorkFlowStatus(workflowId)
        );
        vm.stopPrank();
        vm.startPrank(address(modicumMock));
        uint256[] memory currentJobs = modicumMock.getCurrentJobs();
        console.log("len", currentJobs.length);

        assertEq(tinyHops.getStepStatus(workflowId, 0), STEP_STATUS_STARTED);
        assertEq(currentJobs.length, 1);
        assertEq(modicumMock.getParams(currentJobs[0]), "hello world l0");
        tinyHops.receiveJobResults(currentJobs[0], "fake cid 0");
        currentJobs = modicumMock.getCurrentJobs();
        assertEq(currentJobs.length, 3);
        tinyHops.receiveJobResults(currentJobs[1], "fakecid1");
        currentJobs = modicumMock.getCurrentJobs();
        assertEq(currentJobs.length, 3);
        tinyHops.receiveJobResults(currentJobs[2], "fakecid2");
        currentJobs = modicumMock.getCurrentJobs();
        assertEq(currentJobs.length, 4);
        tinyHops.receiveJobResults(currentJobs[3], "fakecid3");
        (
            uint256[] memory stepIds,
            string[] memory cids,
            string[] memory params
        ) = tinyHops.getWorkFlowResults(workflowId);
        assertEq(params[3], "fake cid 0 hello world fakecid1 l2(0,0) fakecid2");
        assertEq(tinyHops.getBalance(workflowId), 10 ether);
        assertEq(modicumMock.getBalance(), 20 ether);
        //console.log(balance(tinyHops));
        // Step should show as started cause it hasn't completed
        /* assertEq(tinyHops.getStepStatus(workflowId, 0), STEP_STATUS_STARTED);

        // Step should show completed
        assertEq(tinyHops.getStepStatus(workflowId, 1), STEP_STATUS_COMPLETED);
        assertEq(
            WORKFLOW_STATUS_STARTED,
            tinyHops.getWorkFlowStatus(workflowId)
        );

        tinyHops.receiveJobResults(currentJobs[0], "fake cid 0");
        (uint256[] memory stepIds, string[] memory cids) = tinyHops
            .getWorkFlowResults(workflowId);
        assertEq(stepIds[0], 0);
        assertEq(cids[0], "fake cid 0");
        assertEq(stepIds[1], 1);
        assertEq(cids[1], "fake cid 1");
        assertEq(
            tinyHops.getWorkFlowStatus(workflowId),
            WORKFLOW_STATUS_COMPLETED
        );
        */
    }

    function testSequentialJob() public {
        vm.deal(user1, 10 ether);
        vm.startPrank(user1);
        Workflow memory workflow;
        workflow.entries = new WorkflowEntry[][](1);
        workflow.entries[0] = new WorkflowEntry[](1);
        // generate a workflow Entry
        workflow.entries[0][0] = WorkflowEntry(
            5 ether,
            0,
            "cowsay:v0.0.1",
            buildWorkflowParamText("hello world")
        );
        uint256 workflowId = tinyHops.storeWorkflow(workflow);
        assertEq(workflowId, 1);
        assertEq(user1, tinyHops.ownerOf(workflowId));
        tinyHops.startWorkflow{value: 5 ether}(workflowId);
        assertEq(
            WORKFLOW_STATUS_STARTED,
            tinyHops.getWorkFlowStatus(workflowId)
        );
        vm.stopPrank();
        vm.startPrank(address(modicumMock));
        uint256[] memory currentJobs = modicumMock.getCurrentJobs();
        assertEq(tinyHops.getStepStatus(workflowId, 0), STEP_STATUS_STARTED);
        assertEq(currentJobs.length, 1);
        assertEq(modicumMock.getParams(currentJobs[0]), "hello world");
        tinyHops.receiveJobResults(currentJobs[0], "fake cid");
        assertEq(tinyHops.getStepStatus(workflowId, 0), STEP_STATUS_COMPLETED);
        (
            uint256[] memory stepIds,
            string[] memory cids,
            string[] memory params
        ) = tinyHops.getWorkFlowResults(workflowId);
        assertEq(stepIds[0], 0);
        assertEq(cids[0], "fake cid");
        assertEq(
            tinyHops.getWorkFlowStatus(workflowId),
            WORKFLOW_STATUS_COMPLETED
        );
    }

    // TODO
    function testPauseAndResumeJob() public {}

    function testJobStatus() public {}
}
