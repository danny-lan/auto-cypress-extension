import { Box, Button, Flex, Heading, Text, useTheme } from '@chakra-ui/react';
import { TAction } from '../types';
import { useActionsPanelContext } from './context';

const ActionsPanel = () => {
  const theme = useTheme();
  const { actions, startRecording } = useActionsPanelContext();

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
    if (action.type === 'assert' && action.assertType === 'exists') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            {action.type} {action.assertType}
          </Text>
          <Text>{action.sourceFile}</Text>
        </Box>
      );
    }
    if (action.type === 'assert' && action.assertType === 'contains') {
      return (
        <Box borderLeft={`8px solid ${theme.colors.green[300]}`} p={2} mb={2}>
          <Text fontWeight="bold" mb={1}>
            {action.type} element {action.assertType}
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
          <Button my={8} mx="auto" onClick={startRecording}>
            Start recording
          </Button>
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
            <Button flex="1" borderRadius="0">
              Cancel
            </Button>
            <Button flex="1" borderRadius="0" colorScheme="green">
              Generate test suite
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default ActionsPanel;
