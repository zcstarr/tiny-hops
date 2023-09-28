export type Version = string;
type AlwaysFalse = any;
export type StepName = string;
export type StepId = string;
export type StepDesc = string;
export type StepModule = any;
export interface StepItem {
  stepName?: StepName;
  stepId: StepId;
  stepDesc?: StepDesc;
  stepModule: StepModule;
  [k: string]: any;
}
export type StepItems = StepItem[];
export type OneOfStepItemStepItemsNHbN9TxM = StepItems | StepItem;
export type Steps = OneOfStepItemStepItemsNHbN9TxM[];
export interface Workflow {
  version: Version;
  steps: Steps;
  [k: string]: any;
}