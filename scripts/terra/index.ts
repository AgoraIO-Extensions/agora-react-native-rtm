import * as path from 'path';

import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  SimpleTypeKind,
} from '@agoraio-extensions/cxx-parser';
import {
  ParseResult,
  RenderResult,
  TerraContext,
} from '@agoraio-extensions/terra-core';

import { renderWithConfiguration } from '@agoraio-extensions/terra_shared_configs';

import {
  appendNumberToDuplicateMemberFunction,
  filterFile,
  getDefaultValue,
  isMatch,
} from './utils';

const paramOptionalList = require('./config/param_optional_list.json');

interface CXXFileUserData {
  fileName: string;
}

interface TerraNodeUserData {
  isStruct: boolean;
  isEnumz: boolean;
  isClazz: boolean;
  isCallback: boolean;
  hasComment: boolean;
  comment: string;
}

interface ClazzMethodUserData {
  hasComment: boolean;
  comment: string;
}

interface EnumMethodUserData {
  hasComment: boolean;
  comment: string;
}

interface StructMemberVariableUserData {
  hasComment: boolean;
  comment: string;
  hasDefaultValue: boolean;
  defaultValue: any;
}

export default function (
  terraContext: TerraContext,
  args: any,
  parseResult: ParseResult
): RenderResult[] {
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

    cxxfile.nodes = cxxfile.nodes.map((node: CXXTerraNode) => {
      let isCallback = isMatch(node.name, 'isCallback');

      if (node.name === 'StorageEvent') {
        // debugger;
      }

      if (node.__TYPE === CXXTYPE.Clazz) {
        //重载函数重命名, 自动末尾+数字
        //['joinChannel', 'joinChannel'] => ['joinChannel', 'joinChannel2']
        node.asClazz().methods = appendNumberToDuplicateMemberFunction(
          node.asClazz().methods
        );
        node.asClazz().methods.map((method) => {
          const clazzMethodUserData: ClazzMethodUserData = {
            hasComment: method.comment !== '',
            comment: method.comment
              .replace(/^\n/, '* ')
              .replace(/\n$/, '')
              .replace(/\n/g, '\n* '),
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
      }

      if (node.__TYPE === CXXTYPE.Enumz) {
        // debugger;
        node.asEnumz().enum_constants.map((enum_constant) => {
          const clazzMethodUserData: EnumMethodUserData = {
            hasComment: enum_constant.comment !== '',
            comment: enum_constant.comment
              .replace(/^\n/, '* ')
              .replace(/\n$/, '')
              .replace(/\n/g, '\n* '),
          };
          enum_constant.user_data = clazzMethodUserData;
        });
      }

      if (node.__TYPE === CXXTYPE.Struct) {
        node.asStruct().member_variables.map((member_variable) => {
          const structMemberVariableUserData: StructMemberVariableUserData = {
            hasComment: member_variable.comment !== '',
            comment: member_variable.comment
              .replace(/^\n/, '* ')
              .replace(/\n$/, '')
              .replace(/\n/g, '\n* '),
            hasDefaultValue:
              getDefaultValue(node.asStruct(), member_variable).length > 0,
            defaultValue: getDefaultValue(node.asStruct(), member_variable),
          };
          member_variable.type.source = member_variable.type.source.replace(
            '[]',
            ''
          );
          if (member_variable.type.kind === SimpleTypeKind.array_t) {
            member_variable.type.source += '[]';
          }
          member_variable.user_data = structMemberVariableUserData;
        });
      }

      const terraNodeUserData: TerraNodeUserData = {
        isStruct: node.__TYPE === CXXTYPE.Struct,
        isEnumz: node.__TYPE === CXXTYPE.Enumz,
        isClazz: node.__TYPE === CXXTYPE.Clazz,
        isCallback: isCallback,
        hasComment: node.comment !== '',
        comment: node.comment
          .replace(/^\n/, '* ')
          .replace(/\n$/, '')
          .replace(/\n/g, '\n* '),
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
  return renderWithConfiguration({
    fileNameTemplatePath: path.join(
      __dirname,
      'templates',
      'types',
      'file_name.mustache'
    ),
    fileContentTemplatePath: path.join(
      __dirname,
      'templates',
      'types',
      'file_content.mustache'
    ),
    view,
  });
}
