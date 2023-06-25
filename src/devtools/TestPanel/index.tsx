import {
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useActionsPanelContext } from '../ActionsPanel/context';
import { useNetworkPanelContext } from '../NetworkPanel/context';
import writeTestPrompt from '../prompts/cypressTest';
import { applyChanges, requestFromOpenAI } from '../utils';

const TestPanel = () => {
  const { intercepts } = useNetworkPanelContext();
  const { actions } = useActionsPanelContext();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const generateTestSuite = async () => {
    const url = actions[0].type === 'visit' ? actions[0].url : '';
    const items = actions.slice(1).map(a => {
      // @ts-expect-error
      const { details, sourceFile } = a;
      return {
        type: a.type,
        // test id is hard to get cuz this is from reading the source files.
        'data-testid': '???',
        textContent: details?.props?.label || details?.props?.children,
        value: '',
        tagName: '',
      };
    });

    const prompt = writeTestPrompt({
      title,
      url,
      intercepts: intercepts[0],
      items,
    });
    const response = await requestFromOpenAI({
      openAIMethod: 'createChatCompletion',
      requestBody: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
    });

    console.log(response);
    setCode(response);
  };

  const persistChanges = async () => {
    const resp = await applyChanges(actions);
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
