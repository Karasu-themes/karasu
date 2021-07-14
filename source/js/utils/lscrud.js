import { each } from './each';

const _SET = (keyname, value) => {

  localStorage.setItem(keyname, value);

  return _GET(keyname);

}

const _GET = (keyname) => {
  let item = localStorage.getItem(keyname);

  if (!item) return false;

  return item

}

const _REMOVE = (keyname, callback) => {

  let getItem = _GET(keyname);

  if (!getItem) return false;

  localStorage.removeItem(keyname);

  if (callback) callback(keyname, getItem);

  return getItem;

}

const _HAS = (keyname) => {

  let getItem = _GET(keyname);

  if (getItem) {
    return true
  } else {
    return false
  }

}

const _HTML = (keyname, template) => {
  let getItem = _GET(keyname);

  const parserHTML = (obj, value) => {
    return value.replace(/\{\w+\}/g, value => {
      let objName = value.replace(/{|}/g, '');
      return obj[objName];
    })
  }

  if (_HAS(keyname)) {
    let obj = _PARSER(getItem),
      HTML = '';

    if (!Array.isArray(obj)) {
      return parserHTML(obj, template);
    } else {
      each(obj, (index, value) => {
        HTML += parserHTML(value, template)
      });

      return HTML;
    }

  } else {
    return ''
  }

};

const _SERIALIZE = (value) => {
  return JSON.stringify(value);
}

const _PARSER = (value) => {
  return JSON.parse(value);
}

const ls = {
  get: _GET,
  set: _SET,
  remove: _REMOVE,
  has: _HAS,
  serialize: _SERIALIZE,
  parser: _PARSER,
  html: _HTML
}

export { ls };
