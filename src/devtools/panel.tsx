import React from "react";
import ReactDOM from "react-dom/client";
import NetworkPanel from './NetworkPanel';

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(<NetworkPanel />);

export {};
