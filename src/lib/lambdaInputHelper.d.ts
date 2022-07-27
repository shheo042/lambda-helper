import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { HandleTestInputResult, LambdaResponseBody } from "./types/customObject";
import { RestApiSpec } from "./types/restApiSpec";

/**
 * @param {APIGatewayProxyResult} response - APIGatewayProxyResult
 * @param {string} headerKey - 헤더 Key
 * @param {string} headerValue - 헤더 Value
 * @return {APIGatewayProxyResult} 헤더가 추가된 response
 */
export function appendHeaderToResponse(response: APIGatewayProxyResult, headerKey: string, headerValue: string): APIGatewayProxyResult;
export function createRedirectionResponse(url: any, body: any, newToken: any): {
    isBase64Encoded: boolean;
    statusCode: number;
    headers: {
        "Content-Type": string;
        "Access-Control-Expose-Headers": string;
        "Refreshed-Token": any;
        "Access-Control-Allow-Origin": string;
        Location: any;
    };
    body: string;
};
/**
 * @param {LambdaResponseBody} body - Response 생성 시 포함할 body
 * @param {string=} newToken - refresh token
 * @return {APIGatewayProxyResult} 생성된 OK Response
 */
export function createOKResponse(body: LambdaResponseBody, newToken?: string | undefined): APIGatewayProxyResult;
/**
 * @param {APIGatewayEvent} event - Handler로 전달받은 APIGatewayEvent
 * @param {RestApiSpec} apiSpec - apiSpec
 * @return {HandleTestInputResult} { inputObject, checkInputObject }
 */
export function handleTestInput(event: APIGatewayEvent, apiSpec: RestApiSpec): HandleTestInputResult;
export function checkInput(inputObject: any, apiSpec: any): {
    passed: boolean;
    result: string;
    stack: string;
} | {
    passed: boolean;
    result?: undefined;
    stack?: undefined;
};
/**
 * @param {number} httpCode - Response의 status code
 * @param {LambdaResponseBody} body - Response 생성 시 포함할 body
 * @param {string=} reason - 현재 사용되지 않음
 * @return {APIGatewayProxyResult} 생성된 Error Response
 */
export function createErrorResponse(httpCode: number, body: LambdaResponseBody, reason?: string | undefined): APIGatewayProxyResult;
export function createColumnSpec(apiSpec: any): {
    db: string;
    dt: number;
    searchable: boolean;
    projection: boolean;
}[];
export function setDefaultValue(inputObject: any, apiSpec: any): any;
export function replaceAll(str: any, find: any, replace: any): any;
export function createInternalErrorResponse(event: any, error: any, httpCode: any, body: any, reason?: any): Promise<{
    isBase64Encoded: boolean;
    statusCode: any;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
        "api-version": any;
    };
    body: string;
}>;
export function sendError(error: any, event: any): Promise<void>;
export function createPredefinedErrorResponse(errors: any, errorType: any, comment: any): {
    isBase64Encoded: boolean;
    statusCode: any;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
        "api-version": any;
    };
    body: string;
};
/**
 * @param {string} url - Redirect 할 URL
 * @param {LambdaResponseBody} body - Response 생성 시 포함할 body
 * @param {string=} newToken - refresh token
 * @return {APIGatewayProxyResult} 생성된 Redirection Response
 */
export function createRedirectionResponseV2(url: string, body: LambdaResponseBody, newToken?: string | undefined): APIGatewayProxyResult;
/**
 * @param {LambdaResponseBody} body - Response 생성 시 포함할 body
 * @param {string=} newToken - refresh token
 * @return {APIGatewayProxyResult} 생성된 OK Response
 */
export function createOKResponseV2(body: LambdaResponseBody, newToken?: string | undefined): APIGatewayProxyResult;
/**
 * @param {number} httpCode - Response의 status code
 * @param {LambdaResponseBody} body - Response 생성 시 포함할 body
 * @param {string=} reason - 현재 사용되지 않음
 * @return {APIGatewayProxyResult} 생성된 Error Response
 */
export function createErrorResponseV2(httpCode: number, body: LambdaResponseBody, reason?: string | undefined): APIGatewayProxyResult;
export function createInternalErrorResponseV2(event: any, error: any, httpCode: any, body: any, reason?: any): Promise<{
    isBase64Encoded: boolean;
    statusCode: any;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
        "api-version": any;
    };
    body: string;
}>;
export function createPredefinedErrorResponseV2(errors: any, errorType: any, comment: any): {
    isBase64Encoded: boolean;
    statusCode: any;
    headers: {
        "Content-Type": string;
        "Access-Control-Allow-Origin": string;
        "api-version": any;
    };
    body: string;
};
