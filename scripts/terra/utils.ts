import {
  CXXFile,
  CXXTYPE,
  Clazz,
  Enumz,
  MemberFunction,
  MemberVariable,
  Struct,
} from '@agoraio-extensions/cxx-parser';
import { ParseResult } from '@agoraio-extensions/terra-core';

let regMap: any = {
  isCallback: '.*(Observer|Handler|Callback|Receiver|Sink).*',
};

const specialConstructList = require('./config/special_construct_list.json');

export function isMatch(str: string, type: string): boolean {
  let result = false;
  if (regMap[type]) {
    result = new RegExp(regMap[type]).test(str);
  }
  return result;
}

export function appendNumberToDuplicateMemberFunction(
  arr: MemberFunction[]
): MemberFunction[] {
  const count: any = {};
  arr.forEach((item: MemberFunction) => {
    if (count[item.name] === undefined) {
      count[item.name] = 1;
    } else {
      count[item.name]++;
    }

    if (count[item.name] > 1) {
      item.name += count[item.name];
    }
  });
  return arr;
}

export function getDefaultValue(node: Struct, member_variable: MemberVariable) {
  let default_value = '';
  node.constructors.map((constructor) => {
    constructor.initializerList.map((initializer) => {
      if (initializer.name === member_variable.name) {
        initializer.values.map((value, key) => {
          //去掉特例
          if (!specialConstructList.includes(value)) {
            if (key === 0) {
              let valueStr = convertToCamelCase(
                value.replace(new RegExp('^(.*)::(.*)'), '$2')
              ).replace(convertToCamelCase(initializer.type), '');
              default_value += `=${
                member_variable.type.name.match(/boolean|number|string/g)
                  ? ''
                  : member_variable.type.name + '.'
              }${valueStr.charAt(0).toLowerCase() + valueStr.slice(1)}`;
            } else {
              let valueStr = convertToCamelCase(
                value.replace(new RegExp('^(.*)::(.*)'), '$2')
              ).replace(convertToCamelCase(initializer.type), '');
              default_value += `||${
                valueStr.charAt(0).toLowerCase() + valueStr.slice(1)
              }`;
            }
          }
        });
      }
    });
  });
  return default_value;
}

export function lowerFirstWord(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function upperFirstWord(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function deepClone(obj: any, skipKeys?: string[]) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (skipKeys?.includes(key)) {
      continue;
    }
    if (obj.hasOwnProperty(key)) {
      (clone as any)[key] = deepClone(obj[key], skipKeys);
    }
  }

  return clone;
}

export function findClazz(value: string, parseResult: ParseResult) {
  return (
    parseResult?.nodes.flatMap((f) => {
      let file = f as CXXFile;
      return file.nodes.filter((node) => node.__TYPE === CXXTYPE.Clazz);
    }) as Clazz[]
  ).filter((clazz: Clazz) => clazz.name === value);
}

export function findEnumz(value: string, parseResult: ParseResult) {
  return (
    parseResult?.nodes.flatMap((f) => {
      let file = f as CXXFile;
      return file.nodes.filter((node) => node.__TYPE === CXXTYPE.Enumz);
    }) as Enumz[]
  ).filter((enumz: Enumz) => enumz.name === value);
}

export function findStruct(value: string, parseResult: ParseResult) {
  return (
    parseResult?.nodes.flatMap((f) => {
      let file = f as CXXFile;
      return file.nodes.filter((node) => node.__TYPE === CXXTYPE.Struct);
    }) as Struct[]
  ).filter((struct: Struct) => struct.name === value);
}

export function convertToCamelCase(str: string, upperCamelCase = true): string {
  //change RTM_ERROR_CODE to ERROR_CODE globally
  if (str.includes('RTM_ERROR_CODE')) {
    str = str.replace('RTM_ERROR_CODE', 'ERROR_CODE');
  }
  if (/^[A-Z]+$/.test(str)) {
    return str
      .split(' ')
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }

  if (str.indexOf('_') === -1) {
    if (!upperCamelCase) {
      return lowerFirstWord(str);
    } else {
      return str;
    }
  }
  let words = str.replace(/[-_]/g, ' ').split(' ');

  let camelCaseStr = words
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  if (!upperCamelCase) {
    camelCaseStr = lowerFirstWord(camelCaseStr);
  }

  return camelCaseStr;
}
