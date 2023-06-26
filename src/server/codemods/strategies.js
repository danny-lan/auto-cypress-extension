const ts = require('typescript');

const isJsxTextWithString = (node, string) => {
  return (
    ts.isJsxElement(node) &&
    node.children.length === 1 &&
    ts.isJsxText(node.children[0]) &&
    node.children[0].text.trim() === string
  );
};

const findTextInChildrenStrategy = ({ node, props }) => {
  if (!props.children) return false;
  if (isJsxTextWithString(node, props.children)) {
    const hasDataTestId = node.openingElement.attributes.properties.some(
      property => property?.name?.escapedText === 'data-testid'
    );
    if (true || !hasDataTestId) {
      return true;
    }
  }
  return false;
};

const matchPropsInNodeStrategy = ({ node, props }) => {
  const { children, ...propsToFind } = props;
  if (propsToFind.length === 0) return false;
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
    const nodeProps = node.attributes.properties.map(
      prop => prop?.name?.escapedText
    );
    const propLabelsToFind = Object.keys(propsToFind);
    return (
      nodeProps.length === propLabelsToFind.length &&
      nodeProps.every(nodeProp =>
        Boolean(
          propLabelsToFind.some(propLabel => {
            return propLabel === nodeProp;
          })
        )
      )
    );
  }
  return false;
};

const matchAllPropsInSomeNodeStrategy = ({ node, props }) => {
  const { children, ...propsToFind } = props;
  if (propsToFind.length === 0) return false;
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
    const nodeProps = node.attributes.properties.map(
      prop => prop?.name?.escapedText
    );
    const propLabelsToFind = Object.keys(propsToFind);
    return propLabelsToFind.every(propLabel =>
      Boolean(
        nodeProps.some(nodeProp => {
          return propLabel === nodeProp;
        })
      )
    );
  }
  return false;
};

const transformNode = ({ node, testId }) => {
  const hasDataTestId = node.attributes.properties.some(
    property => property?.name?.escapedText === 'data-testid'
  );
  if (hasDataTestId) {
    return;
  }
  node.attributes.properties.push(
    ts.createJsxAttribute(
      ts.createIdentifier('data-testid'),
      ts.createJsxExpression(
        undefined,
        ts.createPropertyAccess(
          ts.createIdentifier('TEST_IDS'),
          ts.createIdentifier(testId)
        )
      )
    )
  );
};

const strategies = [
  findTextInChildrenStrategy,
  matchPropsInNodeStrategy,
  matchAllPropsInSomeNodeStrategy,
];

// Find and modify the identifier within the AST node
const stringTransformer =
  ({ hasAppliedStrategyRef, props, testId }) =>
  context =>
  rootNode => {
    function visit(node) {
      if (hasAppliedStrategyRef.current) {
        return ts.visitEachChild(node, visit, context);
      }

      const strategyArgs = { node, props };
      for (let i = 0; i < strategies.length; i++) {
        const strategyFn = strategies[i];
        if (strategyFn(strategyArgs)) {
          transformNode({ node, testId });
          hasAppliedStrategyRef.current = true;
          break;
        }
      }

      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };

module.exports = {
  stringTransformer,
};
