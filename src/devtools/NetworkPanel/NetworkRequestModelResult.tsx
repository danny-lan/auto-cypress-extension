import React, { FC, useEffect, useState } from "react";
import { useNetworkPanelContext } from "./context";
import {
  pruneObject,
  requestNetworkInterceptFromOpenAI,
  safeJsonParse,
} from "../utils";
import {
  Box,
  Button,
  Code,
  Flex,
  FormErrorIcon,
  Spinner,
  useTheme,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const NetworkRequestModelResult: FC = () => {
  const theme = useTheme();
  const {
    selectedRequestList,
    selectedRequestQueryKeys,
    selectedRequestBodyKeys,
    selectedResponseBodyKeys,
    cancelKeySelection,
  } = useNetworkPanelContext();
  const [code, setCode] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const prunedRequests = selectedRequestList.map((req) => {
      const prunedQuery = req.requestQuery.filter(
        (param) => selectedRequestQueryKeys[param.name]
      );
      const prunedBody = (req.requestBody || []).filter(
        (param) => selectedRequestBodyKeys[param.name]
      );
      const parsedBody = safeJsonParse(req.response.body);
      const prunedResponse = parsedBody
        ? pruneObject(parsedBody, Object.keys(selectedResponseBodyKeys))
        : req.response.body;
      return {
        ...req,
        requestQuery: prunedQuery,
        requestBody: prunedBody,
        response: { status: req.response.status, body: prunedResponse },
      };
    });

    requestNetworkInterceptFromOpenAI(prunedRequests)
      .then((res) => {
        setCode(res);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <Flex
          w="100%"
          h="10rem"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <FormErrorIcon />
          <Box mt={2}>An error occurred</Box>
        </Flex>
      );
    } else if (code) {
      return (
        <Flex w="100%" h="10rem" direction="column">
          <Code fontSize="xs" maxW="100%" whiteSpace="break-spaces">
            {code}
          </Code>
        </Flex>
      );
    } else {
      return (
        <Flex
          w="100%"
          h="10rem"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color={theme.colors.yellow[300]} />
          <Box mt={2}>Loading...</Box>
        </Flex>
      );
    }
  };

  return (
    <Flex
      id="network-panel"
      direction="column"
      w="100vw"
      h="100vh"
      alignItems="stretch"
      overflow="auto"
    >
      <Flex justifyContent="flex-start">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={cancelKeySelection}
          size="sm"
        >
          Go Back
        </Button>
      </Flex>
      {renderContent()}
    </Flex>
  );
};

export default NetworkRequestModelResult;
