import React, { useMemo } from "react";
import { NetworkRequest } from "../types";
import { Box, Button, Flex } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface Props {
  request: NetworkRequest;
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
  const { url, method, response } = request;
  const truncatedUrl = useMemo(() => url.split("/").at(-1), [url]);

  // @ts-ignore
  return (
    <Button
      onClick={() => (isSelected ? onDeselect() : onSelect())}
      isActive={isSelected}
      width="100%"
      flexShrink={0}
      justifyContent="flex-start"
      gap={2}
      px={2}
      size="sm"
    >
      <Box flex="0 16px">
        {isSelected ? <CheckIcon boxSize="0.75em" /> : null}
      </Box>
      <Box flex="1 0" textAlign="left" isTruncated={true}>
        {truncatedUrl}
      </Box>
      <Box flex="0 48px" fontSize="sm">
        {method}
      </Box>
      <Box flex="0 48px">{response.status}</Box>
    </Button>
  );
};

export default NetworkRequestListItem;
