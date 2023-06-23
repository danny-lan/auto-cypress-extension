import React, { useMemo } from "react";
import { useNetworkPanelContext } from "./context";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useTheme,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import {
  getTerminalFieldPaths,
  removeFromObject,
  safeJsonParse,
} from "../utils";
import NetworkPanelButton from "./NetworkPanelButton";

const NetworkStubMatcherPicker: React.FC = () => {
  const theme = useTheme();
  const {
    selectedRequestList,
    cancelRequestSelection,
    selectedRequestQueryKeys,
    selectedRequestBodyKeys,
    selectedResponseBodyKeys,
    setSelectedRequestQueryKeys,
    setSelectedRequestBodyKeys,
    setSelectedResponseBodyKeys,
    confirmKeySelection,
  } = useNetworkPanelContext();

  const firstRequest = useMemo(
    () => selectedRequestList[0],
    [selectedRequestList]
  );

  const reqQueryKeys = useMemo<string[]>(() => {
    const keySet = new Set<string>();
    selectedRequestList.forEach((req) =>
      req.requestQuery.forEach((query) => keySet.add(query.name))
    );
    return [...keySet];
  }, [selectedRequestList]);

  const reqBodyKeys = useMemo<string[]>(() => {
    const keySet = new Set<string>();
    selectedRequestList.forEach((req) =>
      req.requestBody?.forEach((query) => keySet.add(query.name))
    );
    return [...keySet];
  }, [selectedRequestList]);

  const responseBodyKeys = useMemo<string[]>(() => {
    const keySet = new Set<string>();
    selectedRequestList.forEach((req) => {
      const responseBody = safeJsonParse(req.response.body);
      if (responseBody) {
        const terminalFieldPaths = getTerminalFieldPaths(responseBody);
        terminalFieldPaths?.forEach((path) => keySet.add(path));
      }
    });
    return [...keySet];
  }, [selectedRequestList]);

  function renderRequestQuerySelector() {
    return reqQueryKeys?.length ? (
      <>
        <Heading size="xs" color={theme.colors.yellow[400]} p={2}>
          Request Query Keys
        </Heading>
        {reqQueryKeys.map((key) => {
          const isSelected = selectedRequestQueryKeys[key];
          return (
            <NetworkPanelButton
              isSelected={isSelected}
              onSelect={() =>
                setSelectedRequestQueryKeys({
                  ...selectedRequestQueryKeys,
                  [key]: true,
                })
              }
              onDeselect={() =>
                setSelectedRequestQueryKeys(
                  removeFromObject(selectedRequestQueryKeys, key)
                )
              }
            >
              <Box flex="0 16px">
                {isSelected ? <CheckIcon boxSize="0.75em" /> : null}
              </Box>
              <Box>{key}</Box>
            </NetworkPanelButton>
          );
        })}
      </>
    ) : null;
  }

  function renderRequestBodySelector() {
    return reqBodyKeys.length ? (
      <>
        <Heading size="xs" color={theme.colors.yellow[400]} p={2} mt={2}>
          Request Body Keys
        </Heading>
        {reqBodyKeys.map((key) => {
          const isSelected = selectedRequestBodyKeys[key];
          return (
            <NetworkPanelButton
              isSelected={isSelected}
              onSelect={() =>
                setSelectedRequestBodyKeys({
                  ...selectedRequestBodyKeys,
                  [key]: true,
                })
              }
              onDeselect={() =>
                setSelectedRequestBodyKeys(
                  removeFromObject(selectedRequestBodyKeys, key)
                )
              }
            >
              <Box flex="0 16px">
                {isSelected ? <CheckIcon boxSize="0.75em" /> : null}
              </Box>
              <Box>{key}</Box>
            </NetworkPanelButton>
          );
        })}
      </>
    ) : null;
  }

  function renderResponseBodySelector() {
    return responseBodyKeys.length ? (
      <>
        <Heading size="xs" color={theme.colors.yellow[400]} p={2} mt={2}>
          Response Body Keys
        </Heading>
        {responseBodyKeys.map((key) => {
          const isSelected = selectedResponseBodyKeys[key];
          return (
            <NetworkPanelButton
              isSelected={isSelected}
              onSelect={() =>
                setSelectedResponseBodyKeys({
                  ...selectedResponseBodyKeys,
                  [key]: true,
                })
              }
              onDeselect={() =>
                setSelectedResponseBodyKeys(
                  removeFromObject(selectedResponseBodyKeys, key)
                )
              }
            >
              <Box flex="0 16px">
                {isSelected ? <CheckIcon boxSize="0.75em" /> : null}
              </Box>
              <Box>{key}</Box>
            </NetworkPanelButton>
          );
        })}
      </>
    ) : null;
  }

  return (
    <Flex id="network-panel" direction="column" w="100vw" h="100vh">
      <Flex justifyContent="space-between">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={cancelRequestSelection}
          color={theme.colors.red[400]}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmKeySelection}
          rightIcon={<ArrowForwardIcon />}
          disabled={
            !Object.keys(selectedResponseBodyKeys).length &&
            !Object.keys(selectedRequestQueryKeys).length &&
            !Object.keys(selectedRequestBodyKeys).length
          }
          color={theme.colors.green[400]}
        >
          Confirm Keys
        </Button>
      </Flex>

      {renderRequestQuerySelector()}
      {renderRequestBodySelector()}
      {renderResponseBodySelector()}
    </Flex>
  );
};

export default NetworkStubMatcherPicker;
