import type { PreSignUpTriggerEvent } from 'aws-lambda';
import { ApiSpec } from './baseApiSpec';
import type { RequireOnlyOne } from './common';

export type CognitoApiSpec = ApiSpec & {
  type: 'cognito';
  pool?: string; // pool을 이 프로젝트에서 생성할 때
  poolName?: string; // 기존에 생성한 pool을 사용할 때
  trigger: string;
};

export type CognitoPreSignUpApiSpec = CognitoApiSpec & {
  parameters: PreSignUpTriggerEvent['request'];
  responses: PreSignUpTriggerEvent['response'];
};
