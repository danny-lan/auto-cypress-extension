import React from "react";
import ReactDOM from "react-dom/client";
import NetworkPanel from "./NetworkPanel";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import Wrapper from "./Wrapper";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);

rootDiv.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Wrapper />
  </ChakraProvider>
);

export {};
