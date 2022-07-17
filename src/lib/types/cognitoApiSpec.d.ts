import type { PostConfirmationTriggerEvent, PreSignUpTriggerEvent } from 'aws-lambda';
import { BaseTriggerEvent } from 'aws-lambda/trigger/cognito-user-pool-trigger/_common';
import { ApiSpec } from './baseApiSpec';

export type CognitoApiSpec = ApiSpec & {
  type: 'cognito';
  pool?: string; // pool을 이 프로젝트에서 생성할 때
  poolName?: string; // 기존에 생성한 pool을 사용할 때
  trigger: string;
};

export type CognitoTriggerApiSpec<T extends BaseTriggerEvent<K>, K extends string> = CognitoApiSpec & {
  parameters: T['request'];
  responses: T['response'];
};