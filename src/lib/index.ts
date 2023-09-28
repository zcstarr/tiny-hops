import fs from "fs";
import ajv from "ajv";
import path from "path";
import thopsSchema from "../../schema.json";
import {
  WorkflowEntryStruct,
  WorkflowStruct,
} from "../generated/typechain-types/TinyHops.sol/TinyHops";
import { StepItem, Workflow } from "../generated/workflow_schema";
import { ethers, parseEther } from "ethers";

interface StepModule {
  stepId: number;
  cost: string;
  cmd: string;
  params: string;
}

const convertEntryToWorkflowEntry = (entry: StepItem): WorkflowEntryStruct => {
  const stepId = entry.stepId;
  const stepModule = entry.stepModule as StepModule;
  const cost = parseEther(stepModule.cost);
  const cmd = stepModule.cmd;
  const params = stringToByteStream(stepModule.params);
  console.log("string",stepModule.params)
  console.log("bytes",params)
  console.log("hex", Buffer.from(params).toString("hex"))
  return {
    stepId,
    cost,
    cmd,
    params,
  };
};
// Helper function to convert a number to a Uint8Array of specified bytes
/*function numberToUint8Array(num: number, bytes: number): Uint8Array {
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) {
    arr[i] = (num >>> ((bytes - i - 1) * 8)) & 0xff;
  }
  return arr;
}*/



function numberToUint8Array(num: number, bytes: number): Uint8Array {
    const arr = new Uint8Array(bytes);
    const bigNum = BigInt(num);
    for (let i = 0; i < bytes; i++) {
        const shiftAmount = BigInt(bytes - i - 1) * BigInt(8);
        const byteValue = Number((bigNum >> shiftAmount) & BigInt(0xff));
        arr[i] = byteValue;
    }
    return arr;
}

export const stringToByteStream = (params: string): Uint8Array => {
  const segments: Uint8Array[] = [];
  let match: RegExpExecArray | null;
  const regex = /{{stepId\s*:\s*(\d+)}}|([^{}]+)/g;

  while ((match = regex.exec(params)) !== null) {
    if (match[1] !== undefined) {
      // stepId segment
      const segmentType = numberToUint8Array(1, 2);
      const stepId = numberToUint8Array(Number(match[1]),8);
      segments.push(new Uint8Array([...segmentType, ...stepId]));
    } else if (match[2] !== undefined) {
      // Text segment
      const segmentType = numberToUint8Array(0, 2);
      const text = new TextEncoder().encode(match[2]);
      console.log("text", text)
      const textLength = numberToUint8Array(text.length, 8);
      console.log("textLength", textLength, text.length)
      segments.push(new Uint8Array([...segmentType, ...textLength, ...text]));
    }
  }

  const totalLength = segments.reduce(
    (acc, segment) => acc + segment.length,
    0
  );
  const byteStream = new Uint8Array(totalLength);
  let offset = 0;

  for (const segment of segments) {
    byteStream.set(segment, offset);
    offset += segment.length;
  }

  return byteStream;
};

export const convertThopsToWorkflow = (configPath: string): WorkflowStruct => {
  const data = JSON.parse(fs.readFileSync(path.resolve(configPath), "utf-8"));
  const validator = new ajv({ strict: false });
  const validate = validator.compile(thopsSchema);
  const result = validate(data);
  if (result === false) {
    throw new Error("Schema Invalid" + validator.errorsText(validate.errors));
  }
  const workflow = data as Workflow;
  const workflowEntries: WorkflowEntryStruct[][] = workflow.steps.map(
    (stepGroup) => {
      // check if stepGroup is an array

      if (Array.isArray(stepGroup)) {
        return stepGroup.map((step: StepItem) => {
          return convertEntryToWorkflowEntry(step);
        });
      } else {
        return [convertEntryToWorkflowEntry(stepGroup)];
      }
    }
  );
  return {
    entries: workflowEntries,
  };
};
