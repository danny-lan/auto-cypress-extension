const ts = require('typescript');

const checkAndAddImportTransformer = context => rootNode => {
  // Check if we've already imported `TEST_IDS`
  let hasTestIds = false;
  function checkTestIds(node) {
    if (ts.isImportSpecifier(node) && node.name.escapedText === 'TEST_IDS') {
      hasTestIds = true;
    }
    return ts.visitEachChild(node, checkTestIds, context);
  }
  ts.visitNode(rootNode, checkTestIds);

  if (hasTestIds) {
    return rootNode;
  }

  // Check if we've imported 'Apps/solution-builder/constants', which will help in the next step
  let hasImport = false;
  function checkImportPath(node) {
    if (
      ts.isStringLiteral(node) &&
      node.text === 'Apps/solution-builder/constants'
    ) {
      hasImport = true;
    }
    return ts.visitEachChild(node, checkImportPath, context);
  }

  ts.visitNode(rootNode, checkImportPath);

  function addTestIds(node) {
    if (hasImport) {
      // If we already have `import {  } from 'Apps/solution-builder/constants'`, add it to the list
      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier.text === 'Apps/solution-builder/constants'
      ) {
        node.importClause.namedBindings.elements.push(
          ts.createImportSpecifier(
            false,
            undefined,
            ts.createIdentifier('TEST_IDS')
          )
        );
      }
    } else {
      // If we don't have `import {  } from 'Apps/solution-builder/constants'`, create one
      if (ts.isSourceFile(node)) {
        node.statements.unshift(
          ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(
              undefined,
              ts.createNamedImports([
                ts.createImportSpecifier(
                  false,
                  undefined,
                  ts.createIdentifier('TEST_IDS')
                ),
              ])
            ),
            ts.createStringLiteral('Apps/solution-builder/constants')
          )
        );
      }
    }
    return ts.visitEachChild(node, addTestIds, context);
  }

  return ts.visitNode(rootNode, addTestIds);
};

const checkAndAddTestIdImport = sourceFile => {
  const result = ts.transform(sourceFile, [checkAndAddImportTransformer]);
  return result.transformed[0];
};

module.exports = {
  checkAndAddTestIdImport,
};
