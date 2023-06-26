import { Button, extendTheme, ChakraProvider } from '@chakra-ui/react';

import "./App.css";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
      <Button my={8} mx="auto">
          Start recording
        </Button>
      </div>
    </ChakraProvider>
  );
}

export default App;
