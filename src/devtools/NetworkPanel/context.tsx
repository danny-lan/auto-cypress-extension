import React, { createContext, useContext } from "react";
import { NetworkRequest } from "../types";

// Create a context
const NetworkPanelContext = createContext<{
  requests: NetworkRequest[];
  selectedRequests: Record<string, boolean>;
}>({
  requests: [],
  selectedRequests: {},
});

export const NetworkPanelContextProvider = NetworkPanelContext.Provider;

export const useNetworkPanelContext = () => useContext(NetworkPanelContext);
