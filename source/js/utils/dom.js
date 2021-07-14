import { nodeToArr } from "./helper";
/*
Pequeño wrapper para manipular el dom con javascript 
de manera más minimizada
*/

const _QUERY = ( selectorName, nodeParent ) => {
  if (!selectorName) return false;
  let result = (nodeParent ? nodeParent : document).querySelector( selectorName );
  return result
}

const _QUERY_All = ( selectorName, nodeParent ) => {
  if (!selectorName) return false;
  let result = nodeToArr( (nodeParent ? nodeParent : document).querySelectorAll( selectorName ) );
  return result
}

const _QUERY_ID = ( idName ) => {
  if (!idName) return false;
  let result = (nodeParent ? nodeParent : document).getElementById( selectorName );
  return result
}

const _ATTR = ( node, attrName ) => {
  return node.getAttribute(attrName);
}

const _SET_ATTR = ( node, attrName, attrValue ) => {
  return node.setAttribute(attrValue, attrName);
}

const dom = {
  query: _QUERY,
  queryAll: _QUERY_All,
  queryID: _QUERY_ID,
  attr: _ATTR,
  setAttr: _SET_ATTR
}

export { 
  dom, 
  _QUERY as query, 
  _QUERY_All as queryAll,
  _ATTR as attr,
  _SET_ATTR as setAttr
}