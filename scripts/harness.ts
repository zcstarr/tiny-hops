import {stringToByteStream} from "../src/lib/"
import * as config  from "../build/src/config";
import { CustomModicum__factory } from "../build/src/generated/typechain-types";
import { TinyHops__factory } from "../build/src/generated/typechain-types";

const workflowId = 2;
const main = async () => {
const modicum = CustomModicum__factory.connect(config.MODICUM_MOCK_ADDR,config.getWallet());
const tinyHops = TinyHops__factory.connect(config.TINY_HOPS_CONTRACT_ADDR, config.getWallet());
const jobs = await modicum.getCurrentJobs();
await tinyHops.receiveJobResults(jobs[0],"dummycid")
console.log(await tinyHops.getWorkFlowResults(workflowId));
console.log(jobs);
}

main();


