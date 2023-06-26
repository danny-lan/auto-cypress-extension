import { nanoid } from 'nanoid';
import { useEffect, useMemo, useState } from 'react';
import {
  TAction,
  TActionsPanelContext,
  TNetworkPanelContext,
  TNetworkPanelView,
  TNetworkRequest,
} from './types';
import {
  getStableTestId,
  getTerminalFieldsAndValues,
  isClickAction,
  sendEvent,
} from './utils';

export function provideNetworkPanelContext(): TNetworkPanelContext {
  const [requests, setRequests] = useState<TNetworkRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<
    Record<string, TNetworkRequest>
  >({});
  const [view, setView] = useState<TNetworkPanelView>('list');
  const [intercepts, setIntercepts] = useState<string[]>([]);
  const [selectedRequestQueryKeys, setSelectedRequestQueryKeys] = useState<
    Record<string, boolean>
  >({});
  const [selectedRequestBodyKeys, setSelectedRequestBodyKeys] = useState<
    Record<string, boolean>
  >({});
  const [selectedResponseBodyKeys, setSelectedResponseBodyKeys] = useState<
    Record<string, boolean>
  >({});
  const selectedRequestList = useMemo(() => {
    return requests.filter(req => !!selectedRequests[req.id]);
  }, [requests, selectedRequests]);

  useEffect(() => {
    const callback: (
      request: chrome.devtools.network.Request
    ) => void = request => {
      request.getContent(async responseContent => {
        const { url, queryString: requestQuery } = request.request;
        const requestBodyText = request.request.postData?.text;
        const requestBody = requestBodyText
          ? getTerminalFieldsAndValues(JSON.parse(requestBodyText))
          : undefined;
        setRequests([
          ...requests,
          {
            id: nanoid(),
            url,
            requestQuery,
            requestBody,
            method: request.request.method,
            response: {
              status: request.response.status,
              body: responseContent,
            },
          },
        ]);
      });
    };
    chrome.devtools.network.onRequestFinished.addListener(callback);
    return () =>
      chrome.devtools.network.onRequestFinished.removeListener(callback);
  }, [requests]);

  function confirmRequestSelection() {
    setView('match');
  }

  function cancelRequestSelection() {
    setView('list');
    setSelectedRequestQueryKeys({});
    setSelectedRequestBodyKeys({});
    setSelectedResponseBodyKeys({});
  }

  function confirmKeySelection() {
    setView('result');
  }

  return {
    requests,
    setRequests,
    selectedRequests,
    setSelectedRequests,
    selectedRequestList,
    selectedRequestQueryKeys,
    setSelectedRequestQueryKeys,
    selectedRequestBodyKeys,
    setSelectedRequestBodyKeys,
    selectedResponseBodyKeys,
    setSelectedResponseBodyKeys,
    confirmRequestSelection,
    cancelRequestSelection,
    confirmKeySelection,
    cancelKeySelection: confirmRequestSelection,
    view,
    intercepts,
    setIntercepts,
  };
}

export function useFilteredNetworkRequests(
  requests: TNetworkRequest[],
  selectedRequests: Record<string, TNetworkRequest>,
  search: string
) {
  const filteredBySearch = requests.filter(req => req.url.includes(search));
  if (Object.values(selectedRequests).length) {
    const selected = Object.values(selectedRequests)[0];
    return filteredBySearch.filter(req => {
      const path1 = req.url.split('?')[0];
      const path2 = selected.url.split('?')[0];
      return path1 === path2;
    });
  }
  return filteredBySearch;
}

export function provideActionsPanelContext(): TActionsPanelContext {
  const [actions, setActions] = useState<TAction[]>([]);

  useEffect(() => {
    const callback = ({
      message,
      stringifiedPayload,
    }: {
      message: string;
      stringifiedPayload: string;
    }) => {
      console.log('payload', { message, stringifiedPayload });
      switch (message) {
        case 'userClick': {
          const { details, sourceFile, tagName } =
            JSON.parse(stringifiedPayload);
          const testId =
            details.props['data-testid'] ||
            getStableTestId(sourceFile, details.props);
          setActions([
            ...actions,
            { type: 'click', sourceFile, details, tagName, testId },
          ]);
          break;
        }
        case 'userKeyPress': {
          const { text } = JSON.parse(stringifiedPayload);
          const lastAction = actions[actions.length - 1];

          console.log('lastAction', lastAction);

          if (lastAction.type === 'keyboard') {
            // Mutate the last action object to append the new string
            lastAction.text = `${lastAction.text}${text}`;
            setActions([...actions]);
          } else if (
            isClickAction(lastAction) &&
            lastAction.tagName === 'INPUT'
          ) {
            setActions([
              ...actions,
              {
                type: 'keyboard',
                text,
                sourceFile: lastAction.sourceFile,
                tagName: lastAction.tagName,
                testId: lastAction.testId,
              },
            ]);
          }
          break;
        }
        case 'userAssertText': {
          const { details, sourceFile, assertContainsText, tagName } =
            JSON.parse(stringifiedPayload);
          const testId =
            details.props['data-testid'] ||
            getStableTestId(sourceFile, details.props);
          setActions([
            ...actions,
            {
              type: 'assertText',
              sourceFile,
              details,
              assertContainsText,
              tagName,
              testId,
            },
          ]);
          break;
        }
        case 'userAssertExist': {
          const { details, sourceFile, tagName } =
            JSON.parse(stringifiedPayload);
          const testId =
            details.props['data-testid'] ||
            getStableTestId(sourceFile, details.props);
          setActions([
            ...actions,
            {
              type: 'assertExists',
              sourceFile,
              details,
              tagName,
              testId,
            },
          ]);
          break;
        }
        case 'startRecordingResponse': {
          const { url } = JSON.parse(stringifiedPayload);
          setActions([...actions, { type: 'visit', url }]);
          break;
        }
        default:
          console.log('unknown message');
          break;
      }
    };
    chrome.runtime.onMessage.addListener(callback);
    return () => chrome.runtime.onMessage.removeListener(callback);
  }, [actions]);

  const startRecording = () => {
    // Send an event to content.js (which forwards to inject.js) to refresh the page.
    // We expect a `startRecordingResponse` event to be returned, which is handled above.
    console.log('sending event');
    sendEvent('startRecording');
    console.log('sent');
  };

  const cancel = () => {
    console.log('cancelling');
    sendEvent('stopRecording');
    setActions([]);
  };

  console.log(actions);

  return {
    actions,
    startRecording,
    cancel,
  };
}
