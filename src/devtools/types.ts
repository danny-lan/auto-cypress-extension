import { Dispatch, SetStateAction } from 'react';

export type TNetworkPanelView = 'list' | 'match' | 'result';

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

export type TPanelView = 'actions' | 'network' | 'test';

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
  intercepts: string[];
  setIntercepts: Dispatch<SetStateAction<string[]>>;
  confirmRequestSelection: () => void;
  cancelRequestSelection: () => void;
  confirmKeySelection: () => void;
  cancelKeySelection: () => void;
  view: TNetworkPanelView;
};

export type TAction =
  | {
      type: 'click';
      sourceFile?: string;
      details?: { nodes: any[]; props: Record<string, any> };
      tagName: string;
    }
  | {
      type: 'keyboard';
      text: string;
    }
  | {
      type: 'visit';
      url: string;
    }
  | {
      type: 'assert';
      assertType: 'exists';
      sourceFile?: string;
      tagName?: string;
      details?: { nodes: any[]; props: Record<string, any> };
    }
  | {
      type: 'assert';
      assertType: 'contains';
      assertContainsText: string;
      sourceFile?: string;
      tagName?: string;
      details?: { nodes: any[]; props: Record<string, any> };
    };

export type TActionsPanelContext = {
  actions: TAction[];
  startRecording: () => void;
  cancel: () => void;
};
