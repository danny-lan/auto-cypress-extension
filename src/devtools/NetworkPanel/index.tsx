import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { getTerminalFieldsAndValues } from "../utils";
import { TNetworkPanelView, TNetworkRequest } from "../types";
import { NetworkPanelContextProvider } from "./context";
import NetworkRequestList from "./NetworkRequestList";
import NetworkStubMatcherPicker from "./NetworkStubMatcherPicker";
import { useNetworkPanelState } from "./hooks";

const NetworkPanel = () => {
  const state = useNetworkPanelState();
  const { requests, setRequests, view } = state;

  useEffect(() => {
    const callback: (request: chrome.devtools.network.Request) => void = (
      request
    ) => {
      request.getContent(async (responseContent) => {
        const { url, queryString: requestQuery } = request.request;
        const requestBodyText = request.request.postData?.text;
        const requestBody = requestBodyText
          ? getTerminalFieldsAndValues(JSON.parse(requestBodyText))
          : undefined;
        setRequests([
          ...requests,
          {
            id: nanoid(),
            url,
            requestQuery,
            requestBody,
            method: request.request.method,
            response: {
              status: request.response.status,
              body: responseContent,
            },
          },
        ]);
      });
    };
    chrome.devtools.network.onRequestFinished.addListener(callback);
    return () =>
      chrome.devtools.network.onRequestFinished.removeListener(callback);
  }, [requests]);

  function renderView() {
    if (view === "list") {
      return <NetworkRequestList />;
    } else if (view === "match") {
      return <NetworkStubMatcherPicker />;
    }
    console.log(
      state.selectedRequestQueryKeys,
      state.selectedRequestBodyKeys,
      state.selectedResponseBodyKeys
    );
    return null;
  }

  return (
    <NetworkPanelContextProvider value={state}>
      {renderView()}
    </NetworkPanelContextProvider>
  );
};

export default NetworkPanel;
