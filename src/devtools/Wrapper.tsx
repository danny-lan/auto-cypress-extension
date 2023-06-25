import React, { FC, useState } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { TPanelView } from './types';
import { NetworkPanelContextProvider } from './NetworkPanel/context';
import NetworkPanel from './NetworkPanel';
import {
  provideActionsPanelContext,
  provideNetworkPanelContext,
} from './hooks';
import { ActionsPanelContextProvider } from './ActionsPanel/context';
import ActionsPanel from './ActionsPanel';
import { HamburgerIcon, LinkIcon } from '@chakra-ui/icons';
import TestPanel from './TestPanel';

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
              <Button
                onClick={() => setView('actions')}
                size="sm"
                leftIcon={<HamburgerIcon />}
              >
                See Recorded Actions
              </Button>
            )}
          </Flex>
          {view === 'actions' ? (
            <ActionsPanel setView={setView} />
          ) : view === 'network' ? (
            <NetworkPanel setView={setView} />
          ) : (
            <TestPanel />
          )}
        </Flex>
      </NetworkPanelContextProvider>
    </ActionsPanelContextProvider>
  );
};

export default Wrapper;
