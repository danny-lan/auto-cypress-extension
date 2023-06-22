export type NetworkRequestParam = {
  name: string;
  value: any;
};

export type NetworkRequest = {
  id: string;
  url: string;
  requestQuery: NetworkRequestParam[];
  requestBody: NetworkRequestParam[] | undefined;
  response: {
    status: number;
    body: any;
  };
};
