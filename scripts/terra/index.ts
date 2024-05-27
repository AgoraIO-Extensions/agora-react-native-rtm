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

import { getDefaultValue, isMatch } from './utils';

interface CXXFileUserData {
  fileName: string;
}

interface TerraNodeUserData {
  isStruct: boolean;
  isEnumz: boolean;
  isClazz: boolean;
  isCallback: boolean;
}

interface ClazzMethodUserData {
  output: string;
  input: string;
}

interface StructMemberVariableUserData {
  defaultValue: any;
}

export default function (
  terraContext: TerraContext,
  args: any,
  parseResult: ParseResult
): RenderResult[] {
  let cxxfiles = parseResult.nodes as CXXFile[];
  let view = cxxfiles.map((cxxfile: CXXFile) => {
    const cxxUserData: CXXFileUserData = {
      fileName: path.basename(
        cxxfile.file_path,
        path.extname(cxxfile.file_path)
      ),
    };
    cxxfile.user_data = cxxUserData;

    cxxfile.nodes = cxxfile.nodes.map((node: CXXTerraNode) => {
      if (node.name === 'IRtmPresence') {
        // debugger;
      }
      let isCallback = isMatch(node.name, 'isCallback');
      if (node.__TYPE === CXXTYPE.Clazz) {
        node.asClazz().methods.map((method) => {
          const clazzMethodUserData: ClazzMethodUserData = {
            output: '',
            input: '',
          };
          let output_params: string[] = [];
          let input_params: string[] = [];
          method.asMemberFunction().parameters.map((param) => {
            if (param.is_output) {
              input_params.push(`${param.name}?: ${param.type.name}`);
              output_params.push(`${param.name}: ${param.type.name}`);
            } else {
              if (param.default_value) {
                input_params.push(`${param.name}?: ${param.type.name}`);
              } else {
                input_params.push(`${param.name}: ${param.type.name}`);
              }
            }
          });
          if (output_params.length > 0) {
            if (
              method.asMemberFunction().return_type.name !== 'void' &&
              method.asMemberFunction().return_type.name !== 'number'
            ) {
              output_params.push(`result: ${method.return_type.name},`);
            }
          }
          clazzMethodUserData.input = input_params.join(',');
          if (output_params.length > 1) {
            clazzMethodUserData.output = `{${output_params.join(',')}}`;
          } else if (output_params.length == 1) {
            clazzMethodUserData.output = output_params[0]?.split(': ')[1]!;
          } else {
            clazzMethodUserData.output = `${method.return_type.name}`;
          }
          method.user_data = clazzMethodUserData;
        });
      }

      if (node.__TYPE === CXXTYPE.Enumz) {
        node.asEnumz().enum_constants.map((enum_constant) => {
          enum_constant.name =
            enum_constant.name.charAt(0).toUpperCase() +
            enum_constant.name.slice(1);
        });
      }

      if (node.__TYPE === CXXTYPE.Struct) {
        node.asStruct().member_variables.map((member_variable) => {
          const structMemberVariableUserData: StructMemberVariableUserData = {
            defaultValue: getDefaultValue(node.asStruct(), member_variable),
          };
          member_variable.user_data = structMemberVariableUserData;
        });
      }

      const terraNodeUserData: TerraNodeUserData = {
        isStruct: node.__TYPE === CXXTYPE.Struct,
        isEnumz: node.__TYPE === CXXTYPE.Enumz,
        isClazz: node.__TYPE === CXXTYPE.Clazz,
        isCallback: isCallback,
      };
      node.user_data = terraNodeUserData;

      return node;
    });

    return cxxfile;
  });
  //remove Clazz/Enumz/Struct doesn't exist file
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
      'type',
      'file_name.mustache'
    ),
    fileContentTemplatePath: path.join(
      __dirname,
      'templates',
      'type',
      'file_content.mustache'
    ),
    view,
  });
}
