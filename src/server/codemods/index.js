const ts = require('typescript');
const prettier = require('prettier');
const fs = require('fs')
const diff = require('diff');
const { execSync } = require('child_process');
const { stringTransformer } = require('./strategies');

// thanks chatgpt
const runDiffCommand = (contentA, contentB) => {
  // Create temporary files with the provided contents
  const tempFileA = '/tmp/fileA.txt';
  const tempFileB = '/tmp/fileB.txt';

  // Write contents to temporary files
  require('fs').writeFileSync(tempFileA, contentA);
  require('fs').writeFileSync(tempFileB, contentB);

  // Run the diff command
  const response = execSync(`diff -B ${tempFileA} ${tempFileB} || true`, { encoding: 'utf8' });
  console.log(response);
  return response;
};

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false,
});

const strategies = [
  stringTransformer,
];

const applyStrategies = ({ sourceFile, props = {} }) => {
  const hasAppliedStrategyRef = { current: false };

  let result;
  for (let i = 0; i < strategies.length; i++) {
    const strategy = strategies[i];
    result = ts.transform(
      sourceFile, [ strategy({ hasAppliedStrategyRef, props }) ]
    );
    if (hasAppliedStrategyRef.current) break;
  }

  if (hasAppliedStrategyRef.current) {
    return { newSourceFile: result.transformed[0], hasAppliedStrategy: true };
  }

  return { newSourceFile: sourceFile, hasAppliedStrategy: false };
};

const generatePatch = ({ filepath, props }) => {
  const src = fs.readFileSync(filepath, { encoding: 'utf-8' });

  const sourceFile = ts.createSourceFile(
    'x.tsx',
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  
  const { newSourceFile, hasAppliedStrategy } = applyStrategies({ sourceFile, props });
  const newCode = prettier.format(
    printer.printFile(newSourceFile),
    { singleQuote: true, parser: 'typescript', arrowParens: 'avoid', trailingComma: 'es5' }
  );

  return runDiffCommand(src, newCode);
};

module.exports = {
  generatePatch,
};