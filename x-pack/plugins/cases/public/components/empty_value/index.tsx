/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { get, isString } from 'lodash/fp';
import React from 'react';
import styled from 'styled-components';

import * as i18n from './translations';

const EmptyWrapper = styled.span`
  color: ${(props) => props.theme.eui.euiColorMediumShade};
`;

EmptyWrapper.displayName = 'EmptyWrapper';

export const getEmptyValue = () => '—';
export const getEmptyString = () => `(${i18n.EMPTY_STRING})`;

export const getEmptyCellValue = () => <EmptyWrapper>{getEmptyValue()}</EmptyWrapper>;
export const getEmptyStringTag = () => <EmptyWrapper>{getEmptyString()}</EmptyWrapper>;

export const defaultToEmptyTag = <T extends unknown>(item: T): JSX.Element => {
  if (item == null) {
    return getEmptyCellValue();
  } else if (isString(item) && item === '') {
    return getEmptyStringTag();
  } else {
    return <>{item}</>;
  }
};

export const getOrEmptyTag = (path: string, item: unknown): JSX.Element => {
  const text = get(path, item);
  return getOrEmptyTagFromValue(text);
};

export const getOrEmptyTagFromValue = (value: string | number | null | undefined): JSX.Element => {
  if (value == null) {
    return getEmptyCellValue();
  } else if (value === '') {
    return getEmptyStringTag();
  } else {
    return <>{value}</>;
  }
};
