import * as path from 'path';

import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  SimpleTypeKind,
} from '@agoraio-extensions/cxx-parser';

import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import { renderWithConfiguration } from '@agoraio-extensions/terra_shared_configs';

import {
  appendNumberToDuplicateMemberFunction,
  filterFile,
  isMatch,
} from './utils';

const implSpecialReturnList = require('./config/impl_special_return_list.json');
const paramOptionalList = require('./config/param_optional_list.json');

interface CXXFileUserData {
  fileName: string;
}

interface TerraNodeUserData {
  isStruct: boolean;
  isEnumz: boolean;
  isClazz: boolean;
  isCallback: boolean;
  hasBaseClazzs: boolean;
  prefix_name: string;
}

interface ClazzMethodUserData {
  hasParameters: boolean;
  bindingFunctionName?: string;
  bindingIrisKey?: string;
  returnParamName?: string;
}

export function impl(parseResult: ParseResult) {
  let cxxfiles = parseResult.nodes as CXXFile[];
  //移除不需要的文件
  let view = filterFile(cxxfiles).map((cxxfile: CXXFile) => {
    const cxxUserData: CXXFileUserData = {
      fileName: path.basename(
        cxxfile.file_path,
        path.extname(cxxfile.file_path)
      ),
    };
    cxxfile.user_data = cxxUserData;

    let nodes = cxxfile.nodes.filter((node: CXXTerraNode) => {
      return node.__TYPE === CXXTYPE.Clazz;
    });

    cxxfile.nodes = nodes.map((node: CXXTerraNode) => {
      if (node.name === 'IStreamChannelImpl') {
        // debugger;
      }

      //重载函数重命名, 自动末尾+数字
      //['joinChannel', 'joinChannel'] => ['joinChannel', 'joinChannel2']
      node.asClazz().methods = appendNumberToDuplicateMemberFunction(
        node.asClazz().methods
      );
      node.asClazz().methods.map((method) => {
        const clazzMethodUserData: ClazzMethodUserData = {
          hasParameters: method.parameters.length > 0,
          bindingFunctionName: `getApiTypeFrom${
            method.name.charAt(0).toUpperCase() + method.name.slice(1)
          }`,
          returnParamName:
            method.parameters.filter((param) => {
              return param.name === implSpecialReturnList[method.fullName];
            }).length > 0
              ? implSpecialReturnList[method.fullName]
              : 'result',
          bindingIrisKey: `${node.asClazz().name.slice(1)}_${method.name}`,
        };
        method.user_data = clazzMethodUserData;
        method.asMemberFunction().parameters.map((param) => {
          const clazzMethodParametersUserData = {
            isOptional: paramOptionalList.includes(param.fullName),
          };
          if (param.type.kind === SimpleTypeKind.pointer_t) {
            param.type.source = param.type.source.replace('[]', '');
          }
          param.user_data = clazzMethodParametersUserData;
        });
        if (method.return_type.kind === SimpleTypeKind.pointer_t) {
          method.return_type.source = method.return_type.source.replace(
            '[]',
            ''
          );
        }
      });

      const terraNodeUserData: TerraNodeUserData = {
        isStruct: node.__TYPE === CXXTYPE.Struct,
        isEnumz: node.__TYPE === CXXTYPE.Enumz,
        isClazz: node.__TYPE === CXXTYPE.Clazz,
        prefix_name: node.name.replace(new RegExp('^I(.*)'), '$1'),
        hasBaseClazzs: node.asClazz().base_clazzs.length > 0,
        isCallback: isMatch(node.name, 'isCallback'),
      };
      node.user_data = terraNodeUserData;

      return node;
    });
    return cxxfile;
  });
  //移除不含有Clazz,Enumz,Struct的文件
  view = view.filter((cxxfile) => {
    return (
      cxxfile.nodes.filter((node) => {
        return (
          node.__TYPE === CXXTYPE.Clazz ||
          node.__TYPE === CXXTYPE.Enumz ||
          node.__TYPE === CXXTYPE.Struct
        );
      }).length > 0
    );
  });
  return view;
}

export default function (
  terraContext: TerraContext,
  args: any,
  parseResult: ParseResult
) {
  let view = impl(parseResult);
  return renderWithConfiguration({
    fileNameTemplatePath: path.join(
      __dirname,
      'templates',
      'impl',
      'file_name.mustache'
    ),
    fileContentTemplatePath: path.join(
      __dirname,
      'templates',
      'impl',
      'file_content.mustache'
    ),
    view,
  });
}
