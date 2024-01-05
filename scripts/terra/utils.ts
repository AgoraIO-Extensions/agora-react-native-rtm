import {
  MemberFunction,
  MemberVariable,
  Struct,
} from '@agoraio-extensions/cxx-parser';

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
              default_value += `=${
                member_variable.type.name.match(/boolean|number|string/g)
                  ? ''
                  : member_variable.type.name + '.'
              }${value.replace(new RegExp('^(.*)::(.*)'), '$2')}`;
            } else {
              default_value += `||${value}`;
            }
          }
        });
      }
    });
  });
  return default_value;
}
