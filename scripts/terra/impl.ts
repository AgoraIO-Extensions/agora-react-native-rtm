import * as path from 'path';

import {
  CXXFile,
  CXXTYPE,
  CXXTerraNode,
  Variable,
} from '@agoraio-extensions/cxx-parser';

import { ParseResult, TerraContext } from '@agoraio-extensions/terra-core';

import {
  IrisApiIdParserUserData,
  getOverrideNodeParserUserData,
  renderWithConfiguration,
} from '@agoraio-extensions/terra_shared_configs';

import {
  convertToCamelCase,
  deepClone,
  findClazz,
  findEnumz,
  findStruct,
  isMatch,
  upperFirstWord,
} from './utils';

interface CXXFileUserData {
  fileName: string;
  renderFileEnd: boolean;
}

interface TerraNodeUserData {
  isStruct: boolean;
  isEnumz: boolean;
  isClazz: boolean;
  isCallback: boolean;
  hasBaseClazzs: boolean;
  prefix_name: string;
}

interface VariableUserData {
  name: string;
}

interface ClazzMethodUserData extends IrisApiIdParserUserData {
  input: string;
  input_map: Variable[];
  input_map_fixed: Variable[];
  hasParameters: boolean;
  bindingFunctionName?: string;
}

export function impl(parseResult: ParseResult) {
  let preParseResult = deepClone(parseResult, ['parent', 'outVariable']);
  let cxxfiles = parseResult.nodes as CXXFile[];
  //only render file which has clazz
  let view = cxxfiles
    .filter((cxxfile) => {
      return (
        cxxfile.nodes.filter((node) => {
          return node.__TYPE === CXXTYPE.Clazz;
        }).length > 0
      );
    })
    .map((cxxfile: CXXFile) => {
      const cxxUserData: CXXFileUserData = {
        renderFileEnd: false,
        fileName: path.basename(
          cxxfile.file_path,
          path.extname(cxxfile.file_path)
        ),
      };

      let nodes = cxxfile.nodes.filter((node: CXXTerraNode) => {
        return node.__TYPE === CXXTYPE.Clazz;
      });

      cxxfile.nodes = nodes.map((node: CXXTerraNode) => {
        node.asClazz().methods.map((method) => {
          let input_params: string[] = [];
          const clazzMethodUserData: ClazzMethodUserData = {
            input: '',
            input_map: [],
            input_map_fixed: [],
            hasParameters: true,
            bindingFunctionName: `getApiTypeFrom${upperFirstWord(method.name)}`,
            ...method.user_data,
          };
          let overrideNode = getOverrideNodeParserUserData(method);
          if (overrideNode && overrideNode.redirectIrisApiId) {
            clazzMethodUserData.IrisApiIdParser.value =
              overrideNode.redirectIrisApiId;
          }
          // method.return_type.name = convertToCamelCase(method.return_type.name);
          method.asMemberFunction().parameters.map((param) => {
            let variableUserData: VariableUserData = {
              name: convertToCamelCase(param.name, false),
              ...param.user_data,
            };
            let typeName = convertToCamelCase(param.type.name);
            let default_value = convertToCamelCase(param.default_value);
            param.user_data = variableUserData;
            if (!param.is_output) {
              let member = `${variableUserData.name}: ${typeName}`;
              if (param.default_value) {
                if (
                  param.default_value == '__null' ||
                  param.default_value == 'nullptr'
                ) {
                  member = `${variableUserData.name}?: ${typeName}`;
                } else if (param.type.is_builtin_type) {
                  member += ` = ${default_value}`;
                } else {
                  let flag = false;
                  if (findStruct(param.type.name, preParseResult).length > 0) {
                    flag = true;
                    member += ` = new ${default_value}`;
                  }
                  if (findEnumz(param.type.name, preParseResult).length > 0) {
                    flag = true;
                    member += ` =${typeName}.${default_value}`;
                  }
                  if (!flag) {
                    member += ` = ${default_value}`;
                  }
                }
              }
              input_params.push(member);
              clazzMethodUserData.input_map.push(param);
              if (
                typeName !== 'Uint8Array' &&
                findClazz(param.type.name, preParseResult).length <= 0
              ) {
                clazzMethodUserData.input_map_fixed.push(param);
              }
            }
          });
          clazzMethodUserData.input = input_params.join(',');
          clazzMethodUserData.hasParameters =
            clazzMethodUserData.input_map.length > 0;
          method.user_data = clazzMethodUserData;
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
        if (!cxxUserData.renderFileEnd && !terraNodeUserData.isCallback) {
          cxxUserData.renderFileEnd = true;
        }
        return node;
      });

      cxxfile.user_data = cxxUserData;
      return cxxfile;
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
