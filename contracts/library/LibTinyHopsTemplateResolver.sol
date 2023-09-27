pragma solidity ^0.8.15;

// SPDX-License-Identifier: MIT
/* This specifies the format for workflows to be stored in the contract as
a byte stream. The format allows for the representation of template variables in cmds to be run
This allows us to simply store the workflow in the contract, and then apply the variables where needed 
for the command prompt arguments. This is used to transform the templated workflow into a concrete workflow
The format is as follows:
- 2-byte segment type
- 8-byte segment length
- segment data
- repeat
The segment type is either 0 or 1. 0 indicates a text segment, 1 indicates a stepId segment.
The segment length is the length of the segment data in bytes.
The segment data is either the text data or the stepId. If the sgement is the stepId a uint256 is used.
The uint64 is the index of the step in the workflow. It represents the output of that specific step.
This allows us at construction of the workflow to know which steps are dependent on which other steps. 
Allow us to block the execution of a step until the step it depends on has completed.

NOTE - its probably more efficient ot simply store more data and align things in 32byte increments,
additionally using efficient copy operation with pre allocation of the result string would also
be more efficient.
example:

*/
library LibTinyHopsTemplateResolver {
    function applyVariables(
        bytes memory byteStream,
        mapping(uint256 => string) storage replacements
    ) public view returns (string memory) {
        string memory result = "";
        uint256 ptr = 0;
        uint256 startptr = 0;
        uint256 endptr = 0;

        uint256 byteStreamLen = byteStream.length;
        assembly {
            ptr := add(byteStream, 0x20)
            endptr := add(ptr, byteStreamLen)
            startptr := ptr
        }
        while (ptr < endptr) {
            uint256 segmentType;
            uint256 rawType;
            assembly {
                rawType := shr(240, mload(ptr))
                segmentType := shr(240, mload(ptr))
            }
            ptr += 2; // Move past the 2-byte prefix

            if (segmentType == 0) {
                // Text segment
                uint64 textLength;
                assembly {
                    // we have to adjust the pointer to align the values
                    textLength := shr(192, mload(ptr))
                }
                ptr += 8; // Move past the 8-byte length

                bytes memory textBytes = new bytes(textLength);

                uint256 currentPlace = ptr - startptr;
                for (uint64 i = 0; i < textLength; i++) {
                    textBytes[i] = byteStream[currentPlace + i];
                }
                ptr += textLength; // Move past the text data
                result = string(abi.encodePacked(result, string(textBytes)));
            } else if (segmentType == 1) {
                // stepId segment
                uint64 stepId;
                assembly {
                    stepId := shr(192, mload(ptr))
                }
                ptr += 8; // Move past the 8-byte stepId
                result = string(abi.encodePacked(result, replacements[stepId]));
            }
        }

        return result;
    }

    // this allows anyone to validate a byte stream to ensure it is valid prior to a workflow call
    function validateByteStream(bytes memory byteStream) public pure {
        uint256 ptr = 0;
        uint256 endPtr = 0;
        uint256 byteStreamLen = byteStream.length;
        assembly {
            ptr := add(byteStream, 0x20)
            endPtr := add(ptr, byteStreamLen)
        }
        while (ptr < endPtr) {
            // Ensure there's enough data for the 2-byte prefix
            require(ptr + 2 <= endPtr, "Incomplete prefix");

            uint16 segmentType;
            assembly {
                segmentType := shr(240, mload(ptr))
            }
            ptr += 2; // Move past the 2-byte prefix

            if (segmentType == 0) {
                // Text segment
                // Ensure there's enough data for the 8-byte length
                require(ptr + 8 <= endPtr, "Incomplete text length");

                uint64 textLength;
                assembly {
                    textLength := shr(192, mload(ptr))
                }
                ptr += 8; // Move past the 8-byte length

                // Ensure there's enough data for the text
                require(ptr + textLength <= endPtr, "Incomplete text data");
                ptr += textLength; // Move past the text data
            } else if (segmentType == 1) {
                // stepId segment
                // Ensure there's enough data for the 8-byte stepId
                require(ptr + 8 <= endPtr, "Incomplete stepId");
                ptr += 8; // Move past the 8-byte stepId
            } else {
                revert("Invalid segment type");
            }
        }
    }
}
