/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import path from 'path';
import { WebElementWrapper } from '../../../../test/functional/services/lib/web_element_wrapper';
import { FtrProviderContext } from '../ftr_provider_context';

export function IngestPipelinesPageProvider({ getService, getPageObjects }: FtrProviderContext) {
  const testSubjects = getService('testSubjects');
  const pageObjects = getPageObjects(['header', 'common']);
  const aceEditor = getService('aceEditor');

  return {
    async sectionHeadingText() {
      return await testSubjects.getVisibleText('appTitle');
    },

    async createNewPipeline({
      name,
      description,
      version,
      processors,
      onFailureProcessors,
    }: {
      name: string;
      description: string;
      version?: number;
      processors?: string;
      onFailureProcessors?: string;
    }) {
      await testSubjects.click('createPipelineDropdown');
      await testSubjects.click('createNewPipeline');

      await testSubjects.setValue('nameField > input', name);
      await testSubjects.setValue('descriptionField > input', description);

      if (version) {
        await testSubjects.click('versionToggle');
        await testSubjects.setValue('versionField > input', version.toString());
      }

      if (processors) {
        await aceEditor.setValue('processorsEditor', processors);
      }

      if (onFailureProcessors) {
        await testSubjects.click('onFailureToggle');
        await aceEditor.setValue('onFailureEditor', processors);
      }

      await testSubjects.click('submitButton');
      await pageObjects.header.waitUntilLoadingHasFinished();
    },

    async getPipelinesList() {
      const pipelines = await testSubjects.findAll('pipelineTableRow');

      const getPipelineName = async (pipeline: WebElementWrapper) => {
        const pipelineNameElement = await pipeline.findByTestSubject('pipelineTableRow-name');
        return await pipelineNameElement.getVisibleText();
      };

      return await Promise.all(pipelines.map((pipeline) => getPipelineName(pipeline)));
    },

    async clickPipelineLink(index: number) {
      const links = await testSubjects.findAll('pipelineDetailsLink');
      await links.at(index)?.click();
    },

    async createPipelineFromCsv({ name }: { name: string }) {
      await testSubjects.click('createPipelineDropdown');
      await testSubjects.click('createPipelineFromCsv');

      await pageObjects.common.setFileInputPath(
        path.join(__dirname, '..', 'fixtures', 'ingest_pipeline_example_mapping.csv')
      );

      await testSubjects.click('processFileButton');

      await testSubjects.click('continueToCreate');

      await testSubjects.setValue('nameField > input', name);
      await testSubjects.click('submitButton');

      await pageObjects.header.waitUntilLoadingHasFinished();
    },

    async closePipelineDetailsFlyout() {
      await testSubjects.click('euiFlyoutCloseButton');
    },

    async detailsFlyoutExists() {
      return await testSubjects.exists('pipelineDetails');
    },

    async increasePipelineListPageSize() {
      await testSubjects.click('tablePaginationPopoverButton');
      await testSubjects.click(`tablePagination-50-rows`);
    },
  };
}
