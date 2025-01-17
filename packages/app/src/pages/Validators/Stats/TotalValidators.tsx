// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';

export const TotalValidatorsStat = () => {
  const { t } = useTranslation('pages');
  const {
    stakingMetrics: { totalValidators, maxValidatorsCount },
  } = useApi();

  // total validators as percent
  let totalValidatorsAsPercent = 0;
  if (maxValidatorsCount.isGreaterThan(0)) {
    totalValidatorsAsPercent = totalValidators
      .div(maxValidatorsCount.dividedBy(100))
      .toNumber();
  }

  const params = {
    label: t('validators.totalValidators'),
    stat: {
      value: totalValidators.toNumber(),
      total: maxValidatorsCount.toNumber(),
      unit: '',
    },
    graph: {
      value1: totalValidators.toNumber(),
      value2: maxValidatorsCount.minus(totalValidators).toNumber(),
    },
    tooltip: `${new BigNumber(totalValidatorsAsPercent)
      .decimalPlaces(2)
      .toFormat()}%`,
    helpKey: 'Validator',
  };
  return <Pie {...params} />;
};
