import React, { createContext, useContext } from "react";
import { TNetworkPanelView, TNetworkRequest } from "../types";

// Create a context
const NetworkPanelContext = createContext<{
  requests: TNetworkRequest[];
  setRequests: (requests: TNetworkRequest[]) => void;
  selectedRequests: Record<string, TNetworkRequest>;
  setSelectedRequests: (selected: Record<string, TNetworkRequest>) => void;
  selectedRequestQueryKeys: Record<string, boolean>;
  selectedRequestBodyKeys: Record<string, boolean>;
  selectedResponseBodyKeys: Record<string, boolean>;
  setSelectedRequestQueryKeys: (requestQueryKeys: Record<string, boolean>) => void;
  setSelectedRequestBodyKeys: (requestBodyKeys: Record<string, boolean>) => void;
  setSelectedResponseBodyKeys: (responseBodyKeys: Record<string, boolean>) => void;
  confirmRequestSelection: () => void;
  cancelSelection: () => void;
  confirmKeySelection: () => void;
}>({
  requests: [],
  setRequests: () => null,
  selectedRequests: {},
  setSelectedRequests: () => null,
  selectedRequestQueryKeys: {},
  selectedRequestBodyKeys: {},
  selectedResponseBodyKeys: {},
  setSelectedRequestQueryKeys: () => null,
  setSelectedRequestBodyKeys: () => null,
  setSelectedResponseBodyKeys: () => null,
  confirmRequestSelection: () => null,
  cancelSelection: () => null,
  confirmKeySelection: () => null,
});

export const NetworkPanelContextProvider = NetworkPanelContext.Provider;

export const useNetworkPanelContext = () => useContext(NetworkPanelContext);
