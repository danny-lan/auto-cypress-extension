import {
  Button,
  Code,
  Flex,
  FormControl,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useActionsPanelContext } from '../ActionsPanel/context';
import { useNetworkPanelContext } from '../NetworkPanel/context';
import writeTestPrompt from '../prompts/cypressTest';
import { actionToPromptItem, applyChanges, requestFromOpenAI } from '../utils';

const TestPanel = () => {
  const { intercepts } = useNetworkPanelContext();
  const { actions: _actions } = useActionsPanelContext();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const generateTestSuite = async () => {
    let actions = [..._actions];
    let url = 'https://localhost';

    console.log('actions to generate', actions);
    if (actions[0].type === 'visit') {
      url = actions[0].url;
      actions.shift();
    }

    const items = actions.map(action => actionToPromptItem(action));

    const prompt = writeTestPrompt({
      title,
      url,
      intercepts: intercepts[0],
      items,
    });

    console.log('prompt', prompt);
    const response = await requestFromOpenAI({
      openAIMethod: 'createChatCompletion',
      requestBody: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
    });

    console.log(response);
    const actionsWithTestIds = actions.map((action, i) => ({
      ...action,
      testId: items[i].testId,
    }));
    const resp = await applyChanges(actionsWithTestIds);
    console.log(resp);

    // setCode(response);
  };

  const persistChanges = async () => {
    // const resp = await applyChanges(_actions);
  };

  return (
    <div>
      <FormControl>
        <InputGroup>
          <Input type="text" placeholder="Test Name" />
        </InputGroup>
      </FormControl>
      <Button onClick={generateTestSuite}>Generate Test</Button>
      {code && (
        <Flex w="100%" h="10rem" direction="column">
          <Code fontSize="xs" maxW="100%" whiteSpace="break-spaces">
            {code}
          </Code>
        </Flex>
      )}
    </div>
  );
};

export default TestPanel;
