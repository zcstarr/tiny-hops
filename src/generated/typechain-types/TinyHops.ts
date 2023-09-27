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
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface TinyHopsInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "contractAddress"
      | "job1"
      | "job2"
      | "receiveJobResults"
      | "resultCIDs1"
      | "resultCIDs2"
      | "resultJobId1"
      | "resultJobId2"
      | "runBatchSDXL"
      | "runSDXL"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "contractAddress",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "job1", values?: undefined): string;
  encodeFunctionData(functionFragment: "job2", values?: undefined): string;
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
    functionFragment: "runBatchSDXL",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "runSDXL", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "contractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "job1", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "job2", data: BytesLike): Result;
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
    functionFragment: "runBatchSDXL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "runSDXL", data: BytesLike): Result;
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

  contractAddress: TypedContractMethod<[], [string], "view">;

  job1: TypedContractMethod<[], [bigint], "view">;

  job2: TypedContractMethod<[], [bigint], "view">;

  receiveJobResults: TypedContractMethod<
    [_jobID: BigNumberish, _cid: string],
    [void],
    "nonpayable"
  >;

  resultCIDs1: TypedContractMethod<[], [string], "view">;

  resultCIDs2: TypedContractMethod<[], [string], "view">;

  resultJobId1: TypedContractMethod<[], [bigint], "view">;

  resultJobId2: TypedContractMethod<[], [bigint], "view">;

  runBatchSDXL: TypedContractMethod<
    [prompt1: string, prompt2: string],
    [void],
    "payable"
  >;

  runSDXL: TypedContractMethod<[prompt: string], [bigint], "payable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "contractAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "job1"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "job2"
  ): TypedContractMethod<[], [bigint], "view">;
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
    nameOrSignature: "runBatchSDXL"
  ): TypedContractMethod<[prompt1: string, prompt2: string], [void], "payable">;
  getFunction(
    nameOrSignature: "runSDXL"
  ): TypedContractMethod<[prompt: string], [bigint], "payable">;

  filters: {};
}
