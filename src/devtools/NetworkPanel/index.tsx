import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useTheme,
} from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { nanoid } from "nanoid";
import { getTerminalFieldsAndValues } from "../utils";
import { NetworkRequest } from "../types";
import { NetworkPanelContextProvider } from "./context";
import NetworkRequestListItem from "./NetworkRequestListItem";
import { useFilteredNetworkRequests } from "./hooks";

const NetworkPanel = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<
    Record<string, NetworkRequest>
  >({});
  const [search, setSearch] = useState<string>("");
  const filteredRequests = useFilteredNetworkRequests(
    requests,
    selectedRequests,
    search
  );
  const theme = useTheme();

  const stub = () => {};

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

  return (
    <NetworkPanelContextProvider value={{ requests, selectedRequests }}>
      <Flex id="network-panel" direction="column" w="100vw" h="100vh">
        <Flex>
          <IconButton
            aria-label="Clear"
            icon={<DeleteIcon />}
            onClick={() => setRequests([])}
            size="sm"
          />
          <InputGroup size="sm">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
            <InputRightElement>
              <SearchIcon />
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Flex
          id="network-panel-request-list"
          direction="column"
          flexGrow={1}
          overflowY="auto"
          position="relative"
        >
          <Flex
            width="100%"
            gap={2}
            p={2}
            position="sticky"
            top={0}
            background={theme.colors.green[800]}
            zIndex={1}
          >
            <Box flex="0 16px">&nbsp;</Box>
            <Box flex="1 0" textAlign="left" isTruncated={true} fontSize="sm">
              URL
            </Box>
            <Box flex="0 48px" fontSize="sm">
              Method
            </Box>
            <Box flex="0 48px" fontSize="sm">
              Status
            </Box>
          </Flex>
          {filteredRequests.map((request) => (
            <NetworkRequestListItem
              key={request.id}
              request={request}
              isSelected={!!selectedRequests[request.id]}
              onSelect={() =>
                setSelectedRequests({
                  ...selectedRequests,
                  [request.id]: request,
                })
              }
              onDeselect={() =>
                setSelectedRequests(
                  removeFromObject(selectedRequests, request.id)
                )
              }
            />
          ))}
        </Flex>
        <Button onClick={beginStub}>Stub</Button>
      </Flex>
    </NetworkPanelContextProvider>
  );
};

const removeFromObject = (obj: Record<string, any>, key: string) => {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
};

export default NetworkPanel;
