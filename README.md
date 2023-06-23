### Installation

1. Run `yarn install`. Note: I had to switch to node v18.16.1.
2. Run `yarn build`.
3. Navigate to `chrome://extensions/` in Chrome.
4. Toggle "Developer mode" in the top right.
5. Click "Load unpacked" in the top left and select the `dist` directory. You should now see the extension!

### Express server to read and write files
1. Run `yarn file-server` to start the file server on port 3010.
