/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  PluginSetupContract as ActionsPluginSetup,
  PluginStartContract as ActionsPluginStart,
} from '@kbn/actions-plugin/server';
import type {
  AnalyticsServiceSetup,
  CustomRequestHandlerContext,
  KibanaRequest,
  Logger,
  SavedObjectsClientContract,
} from '@kbn/core/server';
import { type MlPluginSetup } from '@kbn/ml-plugin/server';
import { Tool } from 'langchain/dist/tools/base';
import { RetrievalQAChain } from 'langchain/chains';
import { ElasticsearchClient } from '@kbn/core/server';
import { RequestBody } from './lib/langchain/types';
import type { GetRegisteredTools } from './services/app_context';

export const PLUGIN_ID = 'elasticAssistant' as const;

/** The plugin setup interface */
export interface ElasticAssistantPluginSetup {
  actions: ActionsPluginSetup;
}

/** The plugin start interface */
export interface ElasticAssistantPluginStart {
  actions: ActionsPluginStart;
  /**
   * Register tools to be used by the elastic assistant
   * @param pluginName Name of the plugin the tool should be registered to
   * @param tools AssistantTools to be registered with for the given plugin
   */
  registerTools: (pluginName: string, tools: AssistantTool[]) => void;
  /**
   * Get the registered tools
   * @param pluginName Name of the plugin to get the tools for
   */
  getRegisteredTools: GetRegisteredTools;
}

export interface ElasticAssistantPluginSetupDependencies {
  actions: ActionsPluginSetup;
  ml: MlPluginSetup;
}
export interface ElasticAssistantPluginStartDependencies {
  actions: ActionsPluginStart;
}

export interface ElasticAssistantApiRequestHandlerContext {
  actions: ActionsPluginStart;
  getRegisteredTools: GetRegisteredTools;
  logger: Logger;
  telemetry: AnalyticsServiceSetup;
}

/**
 * @internal
 */
export type ElasticAssistantRequestHandlerContext = CustomRequestHandlerContext<{
  elasticAssistant: ElasticAssistantApiRequestHandlerContext;
}>;

export type GetElser = (
  request: KibanaRequest,
  savedObjectsClient: SavedObjectsClientContract
) => Promise<string> | never;

/**
 * Interfaces for registering tools to be used by the elastic assistant
 */

export interface AssistantTool {
  id: string;
  name: string;
  description: string;
  sourceRegister: string;
  isSupported: (params: AssistantToolParams) => boolean;
  getTool: (params: AssistantToolParams) => Tool | null;
}

export interface AssistantToolParams {
  alertsIndexPattern?: string;
  allow?: string[];
  allowReplacement?: string[];
  isEnabledKnowledgeBase: boolean;
  chain: RetrievalQAChain;
  esClient: ElasticsearchClient;
  modelExists: boolean;
  onNewReplacements?: (newReplacements: Record<string, string>) => void;
  replacements?: Record<string, string>;
  request: KibanaRequest<unknown, unknown, RequestBody>;
  size?: number;
}
