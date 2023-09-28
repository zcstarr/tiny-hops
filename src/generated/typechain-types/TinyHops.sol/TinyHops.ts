/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export type WorkflowEntryStruct = {
  cost: BigNumberish;
  stepId: BigNumberish;
  cmd: string;
  params: BytesLike;
};

export type WorkflowEntryStructOutput = [
  cost: bigint,
  stepId: bigint,
  cmd: string,
  params: string
] & { cost: bigint; stepId: bigint; cmd: string; params: string };

export type WorkflowStruct = { entries: WorkflowEntryStruct[][] };

export type WorkflowStructOutput = [entries: WorkflowEntryStructOutput[][]] & {
  entries: WorkflowEntryStructOutput[][];
};

export interface TinyHopsInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "checkAllEntryStepsComplete"
      | "checkPreviousLevelComplete"
      | "contractAddress"
      | "getBalance"
      | "getStepStatus"
      | "getWorkFlowResults"
      | "getWorkFlowStatus"
      | "getWorkHash"
      | "job1"
      | "job2"
      | "ownerOf"
      | "receiveJobResults"
      | "resultCIDs1"
      | "resultCIDs2"
      | "resultJobId1"
      | "resultJobId2"
      | "startWorkflow"
      | "storeWorkflow"
      | "workflowIdCounter"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "WorkflowAdded" | "WorkflowStartedJob"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "checkAllEntryStepsComplete",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "checkPreviousLevelComplete",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "contractAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBalance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getStepStatus",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getWorkFlowResults",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getWorkFlowStatus",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getWorkHash",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "job1", values?: undefined): string;
  encodeFunctionData(functionFragment: "job2", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "receiveJobResults",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "resultCIDs1",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "resultCIDs2",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "resultJobId1",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "resultJobId2",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "startWorkflow",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "storeWorkflow",
    values: [WorkflowStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "workflowIdCounter",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "checkAllEntryStepsComplete",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkPreviousLevelComplete",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getStepStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWorkFlowResults",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWorkFlowStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWorkHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "job1", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "job2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "receiveJobResults",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "resultCIDs1",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "resultCIDs2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "resultJobId1",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "resultJobId2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startWorkflow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "storeWorkflow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "workflowIdCounter",
    data: BytesLike
  ): Result;
}

export namespace WorkflowAddedEvent {
  export type InputTuple = [workflowId: BigNumberish, owner: AddressLike];
  export type OutputTuple = [workflowId: bigint, owner: string];
  export interface OutputObject {
    workflowId: bigint;
    owner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WorkflowStartedJobEvent {
  export type InputTuple = [
    workflowId: BigNumberish,
    jobId: BigNumberish,
    balance: BigNumberish
  ];
  export type OutputTuple = [
    workflowId: bigint,
    jobId: bigint,
    balance: bigint
  ];
  export interface OutputObject {
    workflowId: bigint;
    jobId: bigint;
    balance: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TinyHops extends BaseContract {
  connect(runner?: ContractRunner | null): TinyHops;
  waitForDeployment(): Promise<this>;

  interface: TinyHopsInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  checkAllEntryStepsComplete: TypedContractMethod<
    [_workflowId: BigNumberish],
    [boolean],
    "view"
  >;

  checkPreviousLevelComplete: TypedContractMethod<
    [workflowID: BigNumberish, workflowIndex: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  contractAddress: TypedContractMethod<[], [string], "view">;

  getBalance: TypedContractMethod<[workflowId: BigNumberish], [bigint], "view">;

  getStepStatus: TypedContractMethod<
    [workflowId: BigNumberish, stepId: BigNumberish],
    [bigint],
    "view"
  >;

  getWorkFlowResults: TypedContractMethod<
    [workflowId: BigNumberish],
    [[bigint[], string[], string[]]],
    "view"
  >;

  getWorkFlowStatus: TypedContractMethod<
    [workflowId: BigNumberish],
    [bigint],
    "view"
  >;

  getWorkHash: TypedContractMethod<
    [_workflowId: BigNumberish, _stepId: BigNumberish],
    [string],
    "view"
  >;

  job1: TypedContractMethod<[], [bigint], "view">;

  job2: TypedContractMethod<[], [bigint], "view">;

  ownerOf: TypedContractMethod<[workflowId: BigNumberish], [string], "view">;

  receiveJobResults: TypedContractMethod<
    [_jobID: BigNumberish, _cid: string],
    [void],
    "nonpayable"
  >;

  resultCIDs1: TypedContractMethod<[], [string], "view">;

  resultCIDs2: TypedContractMethod<[], [string], "view">;

  resultJobId1: TypedContractMethod<[], [bigint], "view">;

  resultJobId2: TypedContractMethod<[], [bigint], "view">;

  startWorkflow: TypedContractMethod<
    [workflowId: BigNumberish],
    [bigint],
    "payable"
  >;

  storeWorkflow: TypedContractMethod<
    [workflow: WorkflowStruct],
    [bigint],
    "nonpayable"
  >;

  workflowIdCounter: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "checkAllEntryStepsComplete"
  ): TypedContractMethod<[_workflowId: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "checkPreviousLevelComplete"
  ): TypedContractMethod<
    [workflowID: BigNumberish, workflowIndex: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "contractAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getBalance"
  ): TypedContractMethod<[workflowId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getStepStatus"
  ): TypedContractMethod<
    [workflowId: BigNumberish, stepId: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getWorkFlowResults"
  ): TypedContractMethod<
    [workflowId: BigNumberish],
    [[bigint[], string[], string[]]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getWorkFlowStatus"
  ): TypedContractMethod<[workflowId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getWorkHash"
  ): TypedContractMethod<
    [_workflowId: BigNumberish, _stepId: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "job1"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "job2"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "ownerOf"
  ): TypedContractMethod<[workflowId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "receiveJobResults"
  ): TypedContractMethod<
    [_jobID: BigNumberish, _cid: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "resultCIDs1"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "resultCIDs2"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "resultJobId1"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "resultJobId2"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "startWorkflow"
  ): TypedContractMethod<[workflowId: BigNumberish], [bigint], "payable">;
  getFunction(
    nameOrSignature: "storeWorkflow"
  ): TypedContractMethod<[workflow: WorkflowStruct], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "workflowIdCounter"
  ): TypedContractMethod<[], [bigint], "view">;

  getEvent(
    key: "WorkflowAdded"
  ): TypedContractEvent<
    WorkflowAddedEvent.InputTuple,
    WorkflowAddedEvent.OutputTuple,
    WorkflowAddedEvent.OutputObject
  >;
  getEvent(
    key: "WorkflowStartedJob"
  ): TypedContractEvent<
    WorkflowStartedJobEvent.InputTuple,
    WorkflowStartedJobEvent.OutputTuple,
    WorkflowStartedJobEvent.OutputObject
  >;

  filters: {
    "WorkflowAdded(uint256,address)": TypedContractEvent<
      WorkflowAddedEvent.InputTuple,
      WorkflowAddedEvent.OutputTuple,
      WorkflowAddedEvent.OutputObject
    >;
    WorkflowAdded: TypedContractEvent<
      WorkflowAddedEvent.InputTuple,
      WorkflowAddedEvent.OutputTuple,
      WorkflowAddedEvent.OutputObject
    >;

    "WorkflowStartedJob(uint256,uint256,uint256)": TypedContractEvent<
      WorkflowStartedJobEvent.InputTuple,
      WorkflowStartedJobEvent.OutputTuple,
      WorkflowStartedJobEvent.OutputObject
    >;
    WorkflowStartedJob: TypedContractEvent<
      WorkflowStartedJobEvent.InputTuple,
      WorkflowStartedJobEvent.OutputTuple,
      WorkflowStartedJobEvent.OutputObject
    >;
  };
}
