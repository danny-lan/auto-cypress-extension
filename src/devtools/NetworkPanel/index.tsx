import React from "react";
import { useNetworkPanelContext } from "./context";
import NetworkRequestList from "./NetworkRequestList";
import NetworkStubMatcherPicker from "./NetworkStubMatcherPicker";
import NetworkRequestModelResult from "./NetworkRequestModelResult";

const NetworkPanel = () => {
  const { view } = useNetworkPanelContext();

  if (view === "list") {
    return <NetworkRequestList />;
  } else if (view === "match") {
    return <NetworkStubMatcherPicker />;
  }
  return <NetworkRequestModelResult />;
};

export default NetworkPanel;
