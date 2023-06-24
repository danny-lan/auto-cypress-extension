export type TNetworkPanelView = "list" | "match" | "result";

export type TNetworkRequestParam = {
  name: string;
  value: any;
};

export type TNetworkRequest = {
  id: string;
  url: string;
  requestQuery: TNetworkRequestParam[];
  requestBody: TNetworkRequestParam[] | undefined;
  method: string;
  response: {
    status: number;
    body: any;
  };
};

export type TPanelView = "actions" | "network";

export type TNetworkPanelContext = {
  requests: TNetworkRequest[];
  setRequests: (requests: TNetworkRequest[]) => void;
  selectedRequests: Record<string, TNetworkRequest>;
  setSelectedRequests: (selected: Record<string, TNetworkRequest>) => void;
  selectedRequestList: TNetworkRequest[];
  selectedRequestQueryKeys: Record<string, boolean>;
  selectedRequestBodyKeys: Record<string, boolean>;
  selectedResponseBodyKeys: Record<string, boolean>;
  setSelectedRequestQueryKeys: (
    requestQueryKeys: Record<string, boolean>
  ) => void;
  setSelectedRequestBodyKeys: (
    requestBodyKeys: Record<string, boolean>
  ) => void;
  setSelectedResponseBodyKeys: (
    responseBodyKeys: Record<string, boolean>
  ) => void;
  confirmRequestSelection: () => void;
  cancelRequestSelection: () => void;
  confirmKeySelection: () => void;
  cancelKeySelection: () => void;
  view: TNetworkPanelView;
};

export type TAction = {
  type: "click" | "keyboard" | "assert";
  sourceFile: string;
  details: { nodes: any[]; props: Record<string, any> };
};

export type TActionsPanelContext = {
  actions: TAction[];
};
