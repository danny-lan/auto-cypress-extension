import React, { FC, useEffect } from "react";
import { useNetworkPanelContext } from "./context";
import { pruneObject, requestFromAI, safeJsonParse } from "../utils";
import { Button, Flex } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const NetworkRequestModelResult: FC = () => {
  const {
    selectedRequestList,
    selectedRequestQueryKeys,
    selectedRequestBodyKeys,
    selectedResponseBodyKeys,
    cancelKeySelection,
  } = useNetworkPanelContext();

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
    requestFromAI(prunedRequests).then(code => {
      console.log(code);
    });
  }, []);

  return (
    <Flex id="network-panel" direction="column" w="100vw" h="100vh">
      <Flex justifyContent="flex-start">
        <Button leftIcon={<ArrowBackIcon />} onClick={cancelKeySelection}>
          Go Back
        </Button>
      </Flex>
    </Flex>
  );
};

export default NetworkRequestModelResult;
