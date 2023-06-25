import React, { Dispatch, SetStateAction } from 'react';
import { useNetworkPanelContext } from './context';
import NetworkRequestList from './NetworkRequestList';
import NetworkStubMatcherPicker from './NetworkStubMatcherPicker';
import NetworkRequestModelResult from './NetworkRequestModelResult';
import { TPanelView } from '../types';

const NetworkPanel: React.FC<{
  setView: Dispatch<SetStateAction<TPanelView>>;
}> = ({ setView }) => {
  const { view } = useNetworkPanelContext();

  if (view === 'list') {
    return <NetworkRequestList />;
  } else if (view === 'match') {
    return <NetworkStubMatcherPicker />;
  }
  return <NetworkRequestModelResult setMainView={setView} />;
};

export default NetworkPanel;
