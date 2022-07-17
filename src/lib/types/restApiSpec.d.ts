import { StringMap } from './common';
import { ApiSpec } from './baseApiSpec';

export type ApiSpecParameterElement = {
  req: boolean;
  type: 'String' | 'Integer';
  desc: string;
};

export type ApiSpecParameters = {
  [key: string]: ApiSpecParameterElement;
};

export type ApiSpecResponseData = {
  type: 'JSON';
  desc: string;
  sub: StringMap;
};

export type ApiSpecResponses = {
  data?: ApiSpecResponseData;
};

export type RestApiSpec = ApiSpec & {
  type: 'REST';
  method: 'Get' | 'Post' | 'Put' | 'Delete';
  parameters: ApiSpecParameters;
  responses: ApiSpecResponses;
};
