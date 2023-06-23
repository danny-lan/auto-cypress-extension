import React, { FC } from "react";
import { removeFromObject } from "../utils";
import { Button, useTheme } from "@chakra-ui/react";

interface TProps {
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  children?: React.ReactNode;
}

const NetworkPanelButton: FC<TProps> = ({
  isSelected,
  onSelect,
  onDeselect,
  children,
}) => {
  const theme = useTheme();
  return (
    <Button
      onClick={() => (isSelected ? onDeselect() : onSelect())}
      background={isSelected ? theme.colors.gray[600] : undefined}
      width="100%"
      flexShrink={0}
      justifyContent="flex-start"
      gap={2}
      px={2}
      size="sm"
    >
      {children}
    </Button>
  );
};

export default NetworkPanelButton;
