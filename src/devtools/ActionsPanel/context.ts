import { createContext, useContext } from "react";
import { TActionsPanelContext } from "../types";

// Create a context
const ActionsPanelContext = createContext<TActionsPanelContext>({
  actions: [],
});

export const ActionsPanelContextProvider = ActionsPanelContext.Provider;

export const useActionsPanelContext = () => useContext(ActionsPanelContext);
