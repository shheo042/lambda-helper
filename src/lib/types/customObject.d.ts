import { StringMap } from "./common";

type LambdaInputObject = StringMap;

type LambdaInputCheckObject = {
  passed: boolean;
  reason: string;
  stack: string;
};

interface HandleTestInputResult {
  inputObject: LambdaInputObject;
  inputCheckObject: LambdaInputCheckObject;
}

type LambdaResponseBody = {
  result: string;
  data?: any;
  parameter?: any;
};