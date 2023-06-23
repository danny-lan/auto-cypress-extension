import React from "react";
import { useActionsPanelContext } from "./context";
import { Flex, Heading, useTheme } from "@chakra-ui/react";

const ActionsPanel = () => {
  const theme = useTheme();
  const state = useActionsPanelContext();

  return (
    <Flex id="actions-panel" direction="column" w="100vw" flex="1 0">
      <Heading fontSize="sm" px={2} color={theme.colors.yellow[300]}>
        Recorded Actions
      </Heading>
      <Flex direction="column"></Flex>
    </Flex>
  );
};

export default ActionsPanel;
