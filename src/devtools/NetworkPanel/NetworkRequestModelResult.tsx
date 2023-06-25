import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useNetworkPanelContext } from './context';
import {
  pruneObject,
  requestNetworkInterceptFromOpenAI,
  safeJsonParse,
} from '../utils';
import {
  Box,
  Button,
  Code,
  Flex,
  FormErrorIcon,
  Spinner,
  useTheme,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { TPanelView } from '../types';

const NetworkRequestModelResult: FC<{
  setMainView: Dispatch<SetStateAction<TPanelView>>;
}> = ({ setMainView }) => {
  const theme = useTheme();
  const {
    selectedRequestList,
    selectedRequestQueryKeys,
    selectedRequestBodyKeys,
    selectedResponseBodyKeys,
    cancelKeySelection,
    setIntercepts,
  } = useNetworkPanelContext();
  const [code, setCode] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const prunedRequests = selectedRequestList.map(req => {
      const prunedQuery = req.requestQuery.filter(
        param => selectedRequestQueryKeys[param.name]
      );
      const prunedBody = (req.requestBody || []).filter(
        param => selectedRequestBodyKeys[param.name]
      );
      const parsedBody = safeJsonParse(req.response.body);
      const prunedResponse = parsedBody
        ? pruneObject(parsedBody, Object.keys(selectedResponseBodyKeys))
        : req.response.body;
      return {
        ...req,
        requestQuery: prunedQuery,
        requestBody: prunedBody,
        response: { status: req.response.status, body: prunedResponse },
      };
    });

    requestNetworkInterceptFromOpenAI(prunedRequests)
      .then(res => {
        setCode(res);
        setIntercepts(prev => {
          return [...prev, res];
        });
      })
      .catch(err => {
        setError(err);
      });
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <Flex
          w="100%"
          h="10rem"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <FormErrorIcon />
          <Box mt={2}>An error occurred</Box>
        </Flex>
      );
    } else if (code) {
      return (
        <Flex w="100%" h="10rem" direction="column">
          <Code fontSize="xs" maxW="100%" whiteSpace="break-spaces">
            {code}
          </Code>
        </Flex>
      );
    } else {
      return (
        <Flex
          w="100%"
          h="10rem"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color={theme.colors.yellow[300]} />
          <Box mt={2}>Loading...</Box>
        </Flex>
      );
    }
  };

  return (
    <Flex
      id="network-request-model-result"
      direction="column"
      flex="1 0"
      alignItems="stretch"
      overflow="auto"
    >
      <Flex justifyContent="space-between">
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={cancelKeySelection}
          size="sm"
        >
          Go Back
        </Button>
        <Button
          leftIcon={<ArrowForwardIcon />}
          onClick={() => setMainView('test')}
          size="sm"
        >
          Create Test
        </Button>
      </Flex>
      {renderContent()}
    </Flex>
  );
};

export default NetworkRequestModelResult;
