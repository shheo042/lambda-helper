import { StringMap } from './common';
import { ApiSpec } from './baseApiSpec';

export type RestApiSpecParameterElement = {
  req: boolean;
  type: 'String' | 'Integer' | 'Float' | 'Array' | 'password';
  desc: string;
};

export type RestApiSpecParameters = {
  [key: string]: RestApiSpecParameterElement;
};

export type RestApiSpecResponseData = {
  type: 'JSON';
  desc: string;
  searchable?: boolean;
  sub: StringMap;
};

export type RestApiSpecResponses = {
  data?: RestApiSpecResponseData;
};

export type RestApiSpec = ApiSpec & {
  type: 'REST';
  method: 'Get' | 'Post' | 'Put' | 'Delete';
  parameters: RestApiSpecParameters;
  responses: RestApiSpecResponses;
  authorizer?: string,
  errors?: any; // TODO: 작성필요
};
