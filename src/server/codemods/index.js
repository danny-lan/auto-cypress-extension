const ts = require('typescript');
const prettier = require('prettier');
const fs = require('fs');
const diff = require('diff');
const { execSync } = require('child_process');
const { stringTransformer } = require('./strategies');
const { checkAndAddTestIdImport } = require('./import');

// thanks chatgpt
const runDiffCommand = (contentA, contentB) => {
  // Create temporary files with the provided contents
  const tempFileA = '/tmp/fileA.txt';
  const tempFileB = '/tmp/fileB.txt';

  // Write contents to temporary files
  require('fs').writeFileSync(tempFileA, contentA);
  require('fs').writeFileSync(tempFileB, contentB);

  // Run the diff command, -B flag means we ignore blank line changes
  const response = execSync(`diff -B ${tempFileA} ${tempFileB} || true`, {
    encoding: 'utf8',
  });
  return response;
};

const runPatchCommand = (filepath, patch) => {
  const tempFileA = '/tmp/patch.diff';
  // Write contents to temporary files
  require('fs').writeFileSync(tempFileA, patch);

  // Run the diff command
  const response = execSync(`patch ${filepath} ${tempFileA}`, {
    encoding: 'utf8',
  });
  return response;
};

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false,
});

const applyStrategies = ({ sourceFile, props = {} }) => {
  const hasAppliedStrategyRef = { current: false };

  const result = ts.transform(sourceFile, [
    stringTransformer({ hasAppliedStrategyRef, props, testId: 'foobarbaz' }),
  ]);

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

  let { newSourceFile, hasAppliedStrategy } = applyStrategies({
    sourceFile,
    props,
  });

  if (hasAppliedStrategy) {
    newSourceFile = checkAndAddTestIdImport(newSourceFile);
  }

  const newCode = prettier.format(printer.printFile(newSourceFile), {
    singleQuote: true,
    parser: 'typescript',
    arrowParens: 'avoid',
    trailingComma: 'es5',
  });

  return runDiffCommand(src, newCode);
};

const applyPatch = ({ filepath, patch }) => {
  if (!patch) return;
  runPatchCommand(filepath, patch);
};

module.exports = {
  generatePatch,
  applyPatch,
};
