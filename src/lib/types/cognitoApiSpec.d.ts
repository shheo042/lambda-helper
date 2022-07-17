import type { BaseCustomMessageTriggerEvent } from 'aws-lambda';
import { ApiSpec } from './baseApiSpec';

export type CognitoTriggerApiSpec = ApiSpec & {
  type: 'cognito';
  pool?: string; // pool을 이 프로젝트에서 생성할 때
  poolName?: string; // 기존에 생성한 pool을 사용할 때
  parameters: BaseCustomMessageTriggerEvent<''>['request'];
  responses: BaseCustomMessageTriggerEvent<''>['response'];
};