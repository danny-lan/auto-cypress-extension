import { createContext, useContext } from 'react';
import { TActionsPanelContext } from '../types';

// Create a context
const ActionsPanelContext = createContext<TActionsPanelContext>({
  actions: [],
  startRecording: () => undefined,
  cancel: () => undefined,
});

export const ActionsPanelContextProvider = ActionsPanelContext.Provider;

export const useActionsPanelContext = () => useContext(ActionsPanelContext);
