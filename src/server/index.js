const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const { generatePatch, applyPatch, generateCode } = require('./codemods');
const { createInterface } = require('readline');

// const rl = createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question('Enter OpenAI key:', apiKey => {
  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);

  const app = express();

  app.use(cors());
  app.use(express.json());

  const BASE_PATH = '/Users/erichan/instabase/webserver/shared/src/js/webpacked';
  // const BASE_PATH = '/Users/hoangpaul/Documents/instabase';

  // Endpoint to get file content
  app.get('/file', (req, res) => {
    let { filePath } = req.query;

    if (!filePath) {
      return res.status(400).send('Missing file path');
    }

    // Resolve the path to the base directory
    filePath = path.join(BASE_PATH, filePath);

    // Ensure the resolved path still points to a location inside the base directory
    if (!filePath.startsWith(BASE_PATH)) {
      return res.status(400).send('Invalid file path');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send('An error occurred while reading the file.');
      }
      res.set('Content-Type', 'text/plain');
      return res.send(data);
    });
  });

  // Endpoint to write to a file
  app.post('/file', (req, res) => {
    let { filePath, content } = req.body;

    if (!filePath || !content) {
      return res.status(400).send('Missing file path or content');
    }

    // Resolve the path to the base directory
    filePath = path.join(BASE_PATH, filePath);

    // Ensure the resolved path still points to a location inside the base directory
    if (!filePath.startsWith(BASE_PATH)) {
      return res.status(400).send('Invalid file path');
    }

    fs.writeFile(filePath, content, 'utf8', err => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send('An error occurred while writing to the file.');
      }
      return res.send('File was written successfully.');
    });
  });

  app.post('/open-ai', async (req, res) => {
    try {
      let { openAIMethod, requestBody } = req.body;

      // Validate method
      if (!openAIMethod || typeof openai[openAIMethod] !== 'function') {
        return res
          .status(400)
          .json({ error: 'Invalid or missing OpenAI method' });
      }

      // Validate request body
      if (
        !requestBody ||
        typeof requestBody !== 'object' ||
        Object.keys(requestBody).length === 0
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid or missing request body' });
      }
      console.log(req.body);
      // Call OpenAI API
      const resp = await openai[openAIMethod](requestBody);

      res.json(resp.data);
    } catch (error) {
      console.log(res.error);
      res.status(500).json({ error: error.toString() });
    }
  });


  // Endpoint to generate patch file
  app.get('/diff', (req, res) => {
    let { filepath, props } = req.query;

    if (!filepath) {
      return res.status(400).send('Missing file path');
    }

    // Resolve the path to the base directory
    filepath = path.join(BASE_PATH, filepath);

    // Ensure the resolved path still points to a location inside the base directory
    if (!filepath.startsWith(BASE_PATH)) {
      return res.status(400).send('Invalid file path');
    }

    const patch = generatePatch({ filepath, props: JSON.parse(props) });

    return res.json({ patch });
  });

  // endpoint to apply patch file
  app.post('/patch', (req, res) => {
    let { filepath, patch } = req.body;

    if (!filepath) {
      return res.status(400).send('Missing file path');
    }

    // Resolve the path to the base directory
    filepath = path.join(BASE_PATH, filepath);

    // Ensure the resolved path still points to a location inside the base directory
    if (!filepath.startsWith(BASE_PATH)) {
      return res.status(400).send('Invalid file path');
    }

    applyPatch({ filepath, patch });

    return res.json({ success: true });
  });

  app.post('/apply-code-changes', (req, res) => {
    let { actions } = req.body;

    if (!actions) {
      return res.status(400).send('actions');
    }

    actions.forEach((action) => {
      const { type, sourceFile, details } = action;
      if (type === 'click' || type === 'assert') {
        // Resolve the path to the base directory
        const filepath = path.join(BASE_PATH, sourceFile);

        // Ensure the resolved path still points to a location inside the base directory
        if (!filepath.startsWith(BASE_PATH)) {
          return res.status(400).send('Invalid file path');
        }
        
        const { newCode } = generateCode({ filepath, props: details.props });
        fs.writeFile(filepath, newCode, 'utf8', err => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send('An error occurred while writing to the file.');
          }
        })
      }
    })
   
    return res.json({ success: true });
  })
  app.listen(3010, () => console.log('Server is listening on port 3010'));
// });
