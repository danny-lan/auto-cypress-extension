import React, { useMemo } from "react";
import { NetworkRequest } from "../types";
import { Box, Checkbox, Grid } from "@chakra-ui/react";

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
  const { url, response } = request;
  const truncatedUrl = useMemo(() => url.split("/").at(-1), [url]);

  return (
    <Checkbox
      isChecked={isSelected}
      onClick={() => (isSelected ? onDeselect() : onSelect())}
    >
      <Grid templateColumns="4fr 1fr">
        <Box>{truncatedUrl}</Box>
        <Box>{response.status}</Box>
      </Grid>
    </Checkbox>
  );
};

export default NetworkRequestListItem;
