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
import { useNetworkPanelContext } from "./context";
import NetworkRequestListItem from "./NetworkRequestListItem";
import { useFilteredNetworkRequests } from "../hooks";
import { removeFromObject } from "../utils";

const NetworkRequestList = () => {
  const {
    requests,
    setRequests,
    selectedRequests,
    setSelectedRequests,
    confirmRequestSelection,
  } = useNetworkPanelContext();
  const [search, setSearch] = useState<string>("");
  const filteredRequests = useFilteredNetworkRequests(
    requests,
    selectedRequests,
    search
  );
  const theme = useTheme();

  return (
    <Flex
      id="network-request-list"
      direction="column"
      flex="1 0"
      overflowY="auto"
    >
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
      {Object.keys(selectedRequests).length ? (
        <Button
          color={theme.colors.green[400]}
          onClick={() => confirmRequestSelection()}
          size="sm"
        >
          Stub
        </Button>
      ) : null}
    </Flex>
  );
};

export default NetworkRequestList;
