import { Box, Button, Flex, Heading, Text, useTheme } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { TAction, TPanelView } from '../types';
import { useActionsPanelContext } from './context';

const ActionsPanel: React.FC<{
  setView: Dispatch<SetStateAction<TPanelView>>;
}> = ({ setView }) => {
  const theme = useTheme();
  const { actions, startRecording, cancel } = useActionsPanelContext();

  console.log('state', actions);

  const renderAction = (action: TAction) => {
    if (action.type === 'click') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            {action.type}
          </Text>
          <Text>{action.sourceFile}</Text>
        </Box>
      );
    }
    if (action.type === 'keyboard') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            {action.type}
          </Text>
          <Text>{action.text}</Text>
        </Box>
      );
    }
    if (action.type === 'visit') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            {action.type}
          </Text>
          <Text>{action.url}</Text>
        </Box>
      );
    }
    if (action.type === 'assertExists') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            assert element exists
          </Text>
          <Text>{action.sourceFile}</Text>
        </Box>
      );
    }
    if (action.type === 'assertText') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            assert element contains
          </Text>
          <Text>"{action.assertContainsText}"</Text>
        </Box>
      );
    }
    return 'Unknown action';
  };

  return (
    <Flex id="actions-panel" direction="column" w="100vw" flex="1 0">
      {actions.length === 0 ? (
        <>
          {/* <Button my={8} mx="auto" onClick={startRecording}>
            Start recording
          </Button> */}
        </>
      ) : (
        <>
          <Heading fontSize="sm" px={2} color={theme.colors.yellow[300]}>
            Recorded Actions
          </Heading>
          <Flex direction="column" flexGrow="1">
            {actions.map(action => renderAction(action))}
          </Flex>
          <Flex justify="space-between">
            <Button flex="1" borderRadius="0" onClick={cancel}>
              Cancel
            </Button>
            <Button
              flex="1"
              borderRadius="0"
              colorScheme="green"
              onClick={() => setView('network')}
            >
              Select network stubs
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default ActionsPanel;
