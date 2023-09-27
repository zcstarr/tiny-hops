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

    function getTestStream() public view returns (bytes memory testStream) {
        bytes memory hello = abi.encodePacked(
            uint16(0),
            uint64(6),
            bytes("hello ")
        );
        bytes memory space = abi.encodePacked(uint16(0), uint64(1), bytes(" "));
        bytes memory world = abi.encodePacked(
            uint16(0),
            uint64(7),
            bytes(" world ")
        );
        bytes memory stepId0 = abi.encodePacked(uint16(1), uint64(0));
        bytes memory stepId1 = abi.encodePacked(uint16(1), uint64(1));

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
        vm.startPrank(user1);
        // uint256 workflowId = tinyHops.startWorkflow(workflow);
        // tinyHops.getWorkflow(workflowId);
    }

    function testSequentialJob() public {}

    function testParallelJob() public {}

    function testPauseAndResumeJob() public {}

    function testJobStatus() public {}
}
