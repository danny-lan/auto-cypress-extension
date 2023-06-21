import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Panel = () => {
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    const callback: (request: chrome.devtools.network.Request) => void = (
      request
    ) => {
      request.getContent((body) => {
        setRequests([...requests, body]);
      });
    };
    chrome.devtools.network.onRequestFinished.addListener(callback);
    return () =>
      chrome.devtools.network.onRequestFinished.removeListener(callback);
  }, [requests]);

  return (
    <div id="panel">
      {requests.map((body) => (
        <p
          style={{
            outline: "1px solid green",
            marginBottom: "1rem",
          }}
        >
          {body}
        </p>
      ))}
    </div>
  );
};

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(<Panel />);

export {};
