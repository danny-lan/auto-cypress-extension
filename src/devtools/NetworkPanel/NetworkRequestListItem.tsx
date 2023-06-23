import React, { useMemo } from "react";
import { TNetworkRequest } from "../types";
import { Box, useTheme } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import NetworkPanelButton from "./NetworkPanelButton";

interface Props {
  request: TNetworkRequest;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

const NetworkRequestListItem: React.FC<Props> = ({
  request,
  isSelected,
  onDeselect,
  onSelect,
}) => {
  const theme = useTheme();
  const { url, method, response } = request;
  const truncatedUrl = useMemo(() => url.split("/").at(-1), [url]);

  // @ts-ignore
  return (
    <NetworkPanelButton
      isSelected={isSelected}
      onSelect={onSelect}
      onDeselect={onDeselect}
    >
      <Box flex="0 16px">
        {isSelected ? <CheckIcon boxSize="0.75em" /> : null}
      </Box>
      <Box
        flex="1 0"
        textAlign="left"
        isTruncated={true}
        title={url}
        color={theme.colors.purple[200]}
      >
        {truncatedUrl}
      </Box>
      <Box flex="0 48px" fontSize="sm">
        {method}
      </Box>
      <Box flex="0 48px">{response.status}</Box>
    </NetworkPanelButton>
  );
};

export default NetworkRequestListItem;
