export type NetworkRequestParam = {
  name: string;
  value: any;
};

export type NetworkRequest = {
  requestQuery: NetworkRequestParam[];
  requestBody: NetworkRequestParam[] | undefined;
  responseBody: any;
};
