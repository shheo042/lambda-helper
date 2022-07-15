export type ApiSpec<T extends string> = {
  category: string;
  type: T;
  desc: string;
  parameters: any;
  responses: any;
};
