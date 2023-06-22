import { NetworkRequest } from "../types";

export function useFilteredNetworkRequests(
  requests: NetworkRequest[],
  selectedRequests: Record<string, NetworkRequest>,
  search: string,
) {
  const filteredBySearch = requests.filter(req => req.url.includes(search));
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
