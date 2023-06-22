import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { nanoid } from "nanoid";
import { getTerminalFieldsAndValues } from "../utils";
import { NetworkRequest } from "../types";
import { NetworkPanelContextProvider } from "./context";
import NetworkRequestListItem from "./NetworkRequestListItem";

const NetworkPanel = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<
    Record<string, boolean>
  >({});

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
      <Flex id="network-panel" direction="column">
        <Flex>
          <IconButton
            aria-label="Clear"
            icon={<DeleteIcon />}
            onClick={() => setRequests([])}
          />
          <InputGroup>
            <InputRightElement>
              <SearchIcon />
            </InputRightElement>
            <Input />
          </InputGroup>
          <Input flexGrow={1} />
        </Flex>
        <Flex id="network-panel-request-list" direction="column">
          {requests.map((request) => (
            <NetworkRequestListItem
              key={request.id}
              request={request}
              isSelected={selectedRequests[request.id]}
              onSelect={() =>
                setSelectedRequests({ ...selectedRequests, [request.id]: true })
              }
              onDeselect={() =>
                Object.fromEntries(
                  Object.entries(selectedRequests).filter(
                    ([id]) => id !== request.id
                  )
                )
              }
            />
          ))}
        </Flex>
      </Flex>
    </NetworkPanelContextProvider>
  );
};

export default NetworkPanel;
