const ts = require('typescript');

const isJsxTextWithString = (node, string) => {
  return ts.isJsxElement(node)
    && node.children.length === 1
    && ts.isJsxText(node.children[0])
    && node.children[0].text === string;
}

// Find and modify the identifier within the AST node
const stringTransformer = ({ hasAppliedStrategyRef, props }) => (context) => rootNode => {
  function visit(node) {
    if (hasAppliedStrategyRef.current || !props.children) return ts.visitEachChild(node, visit, context);
    if (isJsxTextWithString(node, props.children)) {
      const hasDataTestId = node.openingElement.attributes.properties.some(property => property.name.escapedText === 'data-testid');
      if (true || !hasDataTestId) {
        node.openingElement.attributes.properties.push(
          ts.createJsxAttribute(
            ts.createIdentifier('data-testid'),
            ts.createJsxExpression(undefined,
              ts.createNumericLiteral('42')  
            )
          )
        );
        hasAppliedStrategyRef.current = true;
      }
    }
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(rootNode, visit);
}

module.exports = {
  stringTransformer,
};
