import { TypeScriptCommonConfig, initCommonTemplate } from 'graphql-codegen-typescript-common';
import { PluginFunction, DocumentFile, transformDocumentsFiles } from 'graphql-codegen-core';
import { flattenTypes } from 'graphql-codegen-compiler';
import { GraphQLSchema } from 'graphql';
import * as Handlebars from 'handlebars';
import * as rootTemplate from './root.handlebars';
import { generateFragments, gql } from './helpers';

export interface TypeScriptReactApolloConfig extends TypeScriptCommonConfig {
  noGraphqlTag?: boolean;
  noHOC?: boolean;
}

export const plugin: PluginFunction<TypeScriptReactApolloConfig> = async (
  schema: GraphQLSchema,
  documents: DocumentFile[],
  config: TypeScriptReactApolloConfig
): Promise<string> => {
  const { templateContext, convert } = initCommonTemplate(Handlebars, schema, config);
  const transformedDocuments = transformDocumentsFiles(schema, documents);
  const flattenDocuments = flattenTypes(transformedDocuments);
  Handlebars.registerHelper('generateFragments', generateFragments(convert));
  Handlebars.registerHelper('gql', gql(convert));

  const hbsContext = {
    ...templateContext,
    ...flattenDocuments
  };

  return Handlebars.compile(rootTemplate)(hbsContext);
};
