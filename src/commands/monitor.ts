import { TinyHops__factory } from "../generated/typechain-types";
import * as config from "../config";
import fs from "fs";
import ajv from "ajv";
import path from "path";
import { Workflow } from "../generated/workflow_schema";
import thopsSchema from "../../schema.json";
interface WorkflowMetadata {
    stepName: string;
    stepDesc: string;
    stepCmd: string;
}

interface ResultMeta {
    resultId: string;
    params: string;
}
export const workflowStatus = async (
  workflowId: string,
  configPath: string
) => {
  const tinyHops = TinyHops__factory.connect(
    config.getTinyHopAddr(),
    config.getWallet()
  );
  const data = JSON.parse(fs.readFileSync(path.resolve(configPath), "utf-8"));
  const validator = new ajv({ strict: false });
  const validate = validator.compile(thopsSchema);
  const result = validate(data);
  if (result === false) {
    throw new Error("Schema Invalid" + validator.errorsText(validate.errors));
  }
  const workflow = data as Workflow;


  const results = await tinyHops.getWorkFlowResults(workflowId);
 const [stepIds, cidResults, parameters] = results;
 const resultMap: any = {}
 stepIds.forEach((stepId: bigint, index: number) => {
    resultMap[stepId.toString()] = {
        resultId: cidResults[index],
        params: parameters[index]
    }
 })

  const workflowMetdataMap:any = {};
  workflow.steps.forEach((stepGroup)=> {
    if(Array.isArray(stepGroup)){
      stepGroup.forEach((step)=> {
        workflowMetdataMap[step.stepId] = {
            stepName: step.stepName,
            stepDesc: step.stepDesc,
            stepCmd: step.stepModule.cmd,
            stepResult: resultMap[step.stepId]
        }
        });

    }else{
        workflowMetdataMap[stepGroup.stepId] = {
            stepName: stepGroup.stepName,
            stepDesc : stepGroup.stepDesc,
            stepCmd: stepGroup.stepModule.cmd,
            stepResult: resultMap[stepGroup.stepId]
        }
    }
  })

  console.log("workflow is currenty:", await getStatusText(workflowId));
  console.log(JSON.stringify(workflowMetdataMap, null, 2));

};
async function getStatusText(workflowId: string): Promise<string> {
  const tinyHops = TinyHops__factory.connect(
    config.getTinyHopAddr(),
    config.getWallet()
  );
  const status = await tinyHops.getWorkFlowStatus(workflowId);
  switch(status.toString()){
    case "0":
      return "Pending";
    case "1":
      return "Running";
    case "2":
      return "Completed";
    default:
      return "Unknown";
  }
}
