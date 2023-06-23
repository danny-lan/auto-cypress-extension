import {
  TActionsPanelContext,
  TNetworkPanelContext,
  TNetworkPanelView,
  TNetworkRequest,
} from "./types";
import { useEffect, useMemo, useState } from "react";
import { getTerminalFieldsAndValues } from "./utils";
import { nanoid } from "nanoid";

export function provideNetworkPanelContext(): TNetworkPanelContext {
  const [requests, setRequests] = useState<TNetworkRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<
    Record<string, TNetworkRequest>
  >({});
  const [view, setView] = useState<TNetworkPanelView>("list");
  const [selectedRequestQueryKeys, setSelectedRequestQueryKeys] = useState<
    Record<string, boolean>
  >({});
  const [selectedRequestBodyKeys, setSelectedRequestBodyKeys] = useState<
    Record<string, boolean>
  >({});
  const [selectedResponseBodyKeys, setSelectedResponseBodyKeys] = useState<
    Record<string, boolean>
  >({});
  const selectedRequestList = useMemo(() => {
    return requests.filter((req) => !!selectedRequests[req.id]);
  }, [requests, selectedRequests]);

  useEffect(() => {
    console.log('chrome.runtime', chrome.runtime, chrome.runtime.onMessage)
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      console.log('msg', msg);
    });
  }, []);

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

  function confirmRequestSelection() {
    setView("match");
  }

  function cancelRequestSelection() {
    setView("list");
    setSelectedRequestQueryKeys({});
    setSelectedRequestBodyKeys({});
    setSelectedResponseBodyKeys({});
  }

  function confirmKeySelection() {
    setView("result");
  }

  return {
    requests,
    setRequests,
    selectedRequests,
    setSelectedRequests,
    selectedRequestList,
    selectedRequestQueryKeys,
    setSelectedRequestQueryKeys,
    selectedRequestBodyKeys,
    setSelectedRequestBodyKeys,
    selectedResponseBodyKeys,
    setSelectedResponseBodyKeys,
    confirmRequestSelection,
    cancelRequestSelection,
    confirmKeySelection,
    cancelKeySelection: confirmRequestSelection,
    view,
  };
}

export function useFilteredNetworkRequests(
  requests: TNetworkRequest[],
  selectedRequests: Record<string, TNetworkRequest>,
  search: string
) {
  const filteredBySearch = requests.filter((req) => req.url.includes(search));
  if (Object.values(selectedRequests).length) {
    const selected = Object.values(selectedRequests)[0];
    return filteredBySearch.filter((req) => {
      const path1 = req.url.split("?")[0];
      const path2 = selected.url.split("?")[0];
      return path1 === path2;
    });
  }
  return filteredBySearch;
}

export function provideActionsPanelContext(): TActionsPanelContext {
  return {};
}
