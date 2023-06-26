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
import {
  actionToPromptItem,
  applyChanges,
  requestFromOpenAI,
  writeFileContent,
} from '../utils';

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
    setCode(response.choices[0].message.content);
  };

  const persistChanges = async () => {
    let actions = [..._actions];
    if (actions[0].type === 'visit') {
      actions.shift();
    }
    const items = actions.map(action => actionToPromptItem(action));
    const actionsWithTestIds = actions.map((action, i) => ({
      ...action,
      testId: items[i].testId,
    }));
    const resp = await applyChanges(actionsWithTestIds);
    console.log(resp);

    // @ts-expect-error
    const sourceSplit = actions[0].sourceFile.split('/');
    const appsIdx = sourceSplit.indexOf('apps');
    let appRoot = sourceSplit;
    if (appsIdx > -1) {
      appRoot = sourceSplit.slice(0, appsIdx + 2);
    }
    const testLocation = [...appRoot, '__e2e__'];

    const writeTestResp = await writeFileContent(
      `${testLocation.join('/')}/${title}`,
      code
    );
    console.log(writeTestResp);
  };

  return (
    <div>
      <FormControl>
        <InputGroup>
          <Input
            type="text"
            placeholder="Test Name"
            onChange={e => setTitle(e.currentTarget.value)}
          />
        </InputGroup>
      </FormControl>
      <Flex>
        <Button onClick={generateTestSuite}>Generate Test</Button>
        {code && <Button onClick={persistChanges}>Save Test</Button>}
      </Flex>
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
