import { TinyHops, TinyHops__factory } from "../generated/typechain-types";
import { WorkflowAddedEvent } from "../generated/typechain-types/TinyHops.sol/TinyHops";

import * as config from "../config"
import { convertThopsToWorkflow } from "../lib";
import { EventLog, ethers } from "ethers";


export const startWorkflowCmd = async (configPath: string, deposit: number) => {

    const workflow = convertThopsToWorkflow(configPath);

    const tinyHops = TinyHops__factory.connect(config.getTinyHopAddr(), config.getWallet())
    console.log(await config.getWallet().provider?.getBlockNumber());
    console.log(await tinyHops.getBalance(0))
    workflow.entries.map(console.log)
    console.log("storing workflow....");
    const tx = await tinyHops.storeWorkflow(workflow);
    try{
    const workflowId = await parseWorkflowAddedEventFromTx(tx);
    console.log("stored worfklow with id:", workflowId);
    console.log(`starting workflow with id ${workflowId}, and ${deposit} eth`);
    const txStart = await tinyHops.startWorkflow(workflowId, {value: ethers.parseEther(deposit.toString())})
    await txStart.wait();
    console.log("workflow started")
    }catch(e){
        console.log("error", e);
    }

}





const parseWorkflowAddedEventFromTx = async (tx: ethers.ContractTransactionResponse): Promise<string> => {
    const receipt = await tx.wait();
    const logs = receipt?.logs;
    const iface = new ethers.Interface([
        "event WorkflowAdded(uint256 workflowId, address owner)"
    ]);
    const parsedLogs = logs?.map(log => iface.parseLog(log as any));
    const workflowAddedEvent = parsedLogs?.find(log => (log as any).name === "WorkflowAdded") as any;
    console.log("WorkflowAdded event:", workflowAddedEvent);
    return workflowAddedEvent.args[0].toString()
};

