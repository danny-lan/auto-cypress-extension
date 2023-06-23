import React, { createContext, useContext } from "react";
import {
  TNetworkPanelContext,
  TNetworkPanelView,
  TNetworkRequest
} from "../types";

// Create a context
const NetworkPanelContext = createContext<TNetworkPanelContext>({
  requests: [],
  setRequests: () => null,
  selectedRequests: {},
  setSelectedRequests: () => null,
  selectedRequestList: [],
  selectedRequestQueryKeys: {},
  selectedRequestBodyKeys: {},
  selectedResponseBodyKeys: {},
  setSelectedRequestQueryKeys: () => null,
  setSelectedRequestBodyKeys: () => null,
  setSelectedResponseBodyKeys: () => null,
  confirmRequestSelection: () => null,
  cancelRequestSelection: () => null,
  confirmKeySelection: () => null,
  cancelKeySelection: () => null,
  view: "list",
});

export const NetworkPanelContextProvider = NetworkPanelContext.Provider;

export const useNetworkPanelContext = () => useContext(NetworkPanelContext);
