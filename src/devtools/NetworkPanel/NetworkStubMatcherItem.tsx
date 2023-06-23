import React, { FC } from "react";
import { removeFromObject } from "../utils";
import { Box, useTheme } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import NetworkPanelButton from "./NetworkPanelButton";

interface GreetingProps {
  matcherKey: string;
  value: string;
  selectedKeys: Record<string, boolean>;
  setSelectedKeys: (keys: Record<string, boolean>) => void;
}

const NetworkStubMatcherItem: FC<GreetingProps> = ({
  matcherKey,
  value,
  selectedKeys,
  setSelectedKeys,
}) => {
  const theme = useTheme();
  const isSelected = selectedKeys[matcherKey];
  return (
    <NetworkPanelButton
      isSelected={isSelected}
      onSelect={() =>
        setSelectedKeys({
          ...selectedKeys,
          [matcherKey]: true,
        })
      }
      onDeselect={() =>
        setSelectedKeys(removeFromObject(selectedKeys, matcherKey))
      }
    >
      <Box flex="0 16px">
        {isSelected ? <CheckIcon boxSize="0.75em" /> : null}
      </Box>
      <Box
        flex="1 0"
        isTruncated={true}
        title={matcherKey}
        color={theme.colors.purple[200]}
        textAlign="left"
      >
        {matcherKey}
      </Box>
      <Box flex="3 0" isTruncated={true} title={value} textAlign="left">
        {value}
      </Box>
    </NetworkPanelButton>
  );
};

export default NetworkStubMatcherItem;
