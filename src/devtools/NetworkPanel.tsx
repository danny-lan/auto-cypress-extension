import React, { useEffect, useState } from "react";
import { getTerminalFieldsAndValues } from "./utils";
import { NetworkRequest } from "./types";

const NetworkPanel = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    const callback: (request: chrome.devtools.network.Request) => void = (
      request
    ) => {
      request.getContent((responseBody) => {
        const requestQuery = request.request.queryString;
        const requestBodyText = request.request.postData?.text;
        const requestBody = requestBodyText
          ? getTerminalFieldsAndValues(JSON.parse(requestBodyText))
          : undefined;
        setRequests([...requests, { requestQuery, requestBody, responseBody }]);
      });
    };
    chrome.devtools.network.onRequestFinished.addListener(callback);
    return () =>
      chrome.devtools.network.onRequestFinished.removeListener(callback);
  }, [requests]);

  return (
    <div id="panel">
      {requests.map(({ requestQuery, requestBody, responseBody }) => (
        <div
          style={{
            outline: "1px solid green",
            marginBottom: "1rem",
          }}
        >
          <p style={{ background: "#a0a0ff" }}>
            {JSON.stringify(requestQuery)}
          </p>
          <p style={{ background: "#a0ffa0" }}>{JSON.stringify(requestBody)}</p>
          <p style={{ background: "#ffa0a0" }}>{responseBody}</p>
        </div>
      ))}
    </div>
  );
};

export default NetworkPanel;
