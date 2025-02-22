/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { ControlGroupRenderer } from '@kbn/controls-plugin/public';
import { Query } from '@kbn/es-query';
import { DataPublicPluginStart } from '@kbn/data-plugin/public';
import { euiStyled } from '@kbn/kibana-react-plugin/common';
import { useControlPanels } from '../hooks/use_control_panels';
import { LogExplorerControllerStateService } from '../state_machines/log_explorer_controller';

const DATASET_FILTERS_CUSTOMIZATION_ID = 'datasetFiltersCustomization';

interface CustomDatasetFiltersProps {
  logExplorerControllerStateService: LogExplorerControllerStateService;
  data: DataPublicPluginStart;
}

const CustomDatasetFilters = ({
  logExplorerControllerStateService,
  data,
}: CustomDatasetFiltersProps) => {
  const { getInitialInput, setControlGroupAPI, query, filters, timeRange } = useControlPanels(
    logExplorerControllerStateService,
    data
  );

  return (
    <ControlGroupContainer data-test-subj={DATASET_FILTERS_CUSTOMIZATION_ID}>
      <ControlGroupRenderer
        ref={setControlGroupAPI}
        getCreationOptions={getInitialInput}
        query={query as Query}
        filters={filters ?? []}
        timeRange={timeRange}
      />
    </ControlGroupContainer>
  );
};

const ControlGroupContainer = euiStyled.div`
[class*='options_list_popover_footer--OptionsListPopoverFooter'] {
  display: none;
}

[data-test-subj='optionsListControl__sortingOptionsButton'] {
  display: none;
}

[id^='control-popover'] .euiPopoverTitle {
  display: none;
}

  .euiFlexGroup.controlGroup {
    min-height: 32px;
  }

  .euiFormControlLayout.euiFormControlLayout--group.controlFrame__formControlLayout {
    height: 32px;

    & .euiFormLabel.controlFrame__formControlLayoutLabel {
      padding: 8px !important;
    }

    .euiButtonEmpty.euiFilterButton {
      height: 32px;
    }
  }

  .euiText.errorEmbeddableCompact__button {
    padding: 8px;

    .euiLink {
      display: flex;
      gap: 8px;
    }
  }
`;

// eslint-disable-next-line import/no-default-export
export default CustomDatasetFilters;
