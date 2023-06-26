import { ArrowRightIcon, HamburgerIcon, LinkIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { FC, useState } from 'react';
import ActionsPanel from './ActionsPanel';
import { ActionsPanelContextProvider } from './ActionsPanel/context';
import {
  provideActionsPanelContext,
  provideNetworkPanelContext,
} from './hooks';
import NetworkPanel from './NetworkPanel';
import { NetworkPanelContextProvider } from './NetworkPanel/context';
import TestPanel from './TestPanel';
import { TPanelView } from './types';

const Wrapper: FC = () => {
  const networkPanelState = provideNetworkPanelContext();
  const actionsPanelContext = provideActionsPanelContext();
  const [view, setView] = useState<TPanelView>('actions');

  return (
    <ActionsPanelContextProvider value={actionsPanelContext}>
      <NetworkPanelContextProvider value={networkPanelState}>
        <Flex direction="column" w="100vw" h="100vh" alignItems="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading fontSize="sm" px={2}>
              {view === 'actions' ? 'Actions' : 'Network Calls'}
            </Heading>
            {view === 'actions' ? (
              <Button
                onClick={() => setView('network')}
                size="sm"
                leftIcon={<LinkIcon />}
              >
                Stub Network Calls
              </Button>
            ) : (
              <Flex>
                <Button
                  onClick={() => setView('actions')}
                  size="sm"
                  leftIcon={<HamburgerIcon />}
                >
                  See Recorded Actions
                </Button>
                {view === 'network' && (
                  <Button
                    onClick={() => setView('test')}
                    size="sm"
                    ml={1}
                    rightIcon={<ArrowRightIcon />}
                  >
                    Skip
                  </Button>
                )}
              </Flex>
            )}
          </Flex>
          {view === 'actions' ? (
            <ActionsPanel setView={setView} />
          ) : view === 'network' ? (
            <NetworkPanel setView={setView} />
          ) : view === 'test' ? (
            <TestPanel />
          ) : (
            'unknown view'
          )}
        </Flex>
      </NetworkPanelContextProvider>
    </ActionsPanelContextProvider>
  );
};

export default Wrapper;
