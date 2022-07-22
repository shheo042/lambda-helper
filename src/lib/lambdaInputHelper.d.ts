import { RestApiSpec } from './types/restApiSpec';
import { StringMap } from './types/common';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

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

declare function handleTestInput(event: APIGatewayEvent, apiSpec: RestApiSpec): HandleTestInputResult;

declare function createErrorResponse(
  httpStatusCode: number,
  body: LambdaResponseBody,
  reason?: string
): APIGatewayProxyResult;

declare function createErrorResponseV2(
  httpStatusCode: number,
  body: LambdaResponseBody,
  reason?: string
): APIGatewayProxyResult;

declare function createInternalErrorResponse(
  httpStatusCode: number,
  body: LambdaResponseBody,
  reason?: string
): APIGatewayProxyResult;

declare function createOKResponse(body: LambdaResponseBody, newToken?: string): APIGatewayProxyResult;

declare function createOKResponseV2(body: LambdaResponseBody, newToken?: string): APIGatewayProxyResult;

declare function appendHeaderToResponse(response: APIGatewayProxyResult, headerKey: string, headerValue: string): APIGatewayProxyResult;

declare function createRedirectionResponseV2(url: string, body: LambdaResponseBody, newToken?: string): APIGatewayProxyResult;