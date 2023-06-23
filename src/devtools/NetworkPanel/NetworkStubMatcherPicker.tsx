import React, { useMemo } from "react";
import get from "lodash/get";
import { useNetworkPanelContext } from "./context";
import { Button, Flex, Heading, useTheme } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { getTerminalFieldPaths, safeJsonParse } from "../utils";
import NetworkStubMatcherItem from "./NetworkStubMatcherItem";

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

  const firstRequestValues = useMemo(() => {
    const firstRequest = selectedRequestList[0];
    return {
      requestQuery: firstRequest.requestQuery,
      requestBody: firstRequest.requestBody || [],
      responseBody: safeJsonParse(firstRequest.response.body) || {},
    };
  }, [selectedRequestList]);

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
        {reqQueryKeys.map((key) => (
          <NetworkStubMatcherItem
            matcherKey={key}
            value={
              firstRequestValues.requestQuery.find(
                (query) => query.name === key
              )!.value
            }
            selectedKeys={selectedRequestQueryKeys}
            setSelectedKeys={setSelectedRequestQueryKeys}
          />
        ))}
      </>
    ) : null;
  }

  function renderRequestBodySelector() {
    return reqBodyKeys.length ? (
      <>
        <Heading size="xs" color={theme.colors.yellow[400]} p={2} mt={2}>
          Request Body Keys
        </Heading>
        {reqBodyKeys.map((key) => (
          <NetworkStubMatcherItem
            matcherKey={key}
            value={
              firstRequestValues.requestBody.find(
                (param) => param.name === key
              )!.value
            }
            selectedKeys={selectedRequestBodyKeys}
            setSelectedKeys={setSelectedRequestBodyKeys}
          />
        ))}
      </>
    ) : null;
  }

  function renderResponseBodySelector() {
    return responseBodyKeys.length ? (
      <>
        <Heading size="xs" color={theme.colors.yellow[400]} p={2} mt={2}>
          Response Body Keys
        </Heading>
        {responseBodyKeys.map((key) => (
          <NetworkStubMatcherItem
            matcherKey={key}
            value={get(firstRequestValues.responseBody, key)}
            selectedKeys={selectedResponseBodyKeys}
            setSelectedKeys={setSelectedResponseBodyKeys}
          />
        ))}
      </>
    ) : null;
  }

  return (
    <Flex
      id="network-matcher-picker"
      direction="column"
      flex="1 0"
      overflowY="auto"
    >
      <Flex justifyContent="space-between">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={cancelRequestSelection}
          color={theme.colors.red[400]}
          size="sm"
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
          size="sm"
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
