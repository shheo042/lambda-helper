import type { BaseCustomMessageTriggerEvent } from 'aws-lambda';
import { ApiSpec } from './baseApiSpec';

export type CognitoTriggerApiSpec = ApiSpec & {
  type: 'cognito';
  poolNameRef: string;
  trigger: string;
  parameters: any;
  responses: any;
};