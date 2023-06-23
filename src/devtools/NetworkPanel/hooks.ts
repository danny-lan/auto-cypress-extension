import { TNetworkPanelView, TNetworkRequest } from "../types";
import { useMemo, useState } from "react";

export function useNetworkPanelState() {
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
