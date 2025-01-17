// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleDown } from '@fortawesome/free-solid-svg-icons';
import { minDecimalPlaces } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { usePayouts } from 'contexts/Payouts';
import { useOverlay } from 'kits/Overlay/Provider';
import { Stat } from 'library/Stat';
import { planckToUnitBn } from 'library/Utils';
import { useTranslation } from 'react-i18next';

export const UnclaimedPayoutsStatus = ({ dimmed }: { dimmed: boolean }) => {
  const { t } = useTranslation();
  const {
    networkData: { units },
  } = useNetwork();
  const { isReady } = useApi();
  const { openModal } = useOverlay().modal;
  const { unclaimedPayouts } = usePayouts();
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();

  const totalUnclaimed = Object.values(unclaimedPayouts || {}).reduce(
    (total, paginatedValidators) =>
      Object.values(paginatedValidators)
        .reduce((amount, [, value]) => amount.plus(value), new BigNumber(0))
        .plus(total),
    new BigNumber(0)
  );

  return (
    <Stat
      label={t('nominate.pendingPayouts', { ns: 'pages' })}
      helpKey="Payout"
      type="odometer"
      stat={{
        value: minDecimalPlaces(
          planckToUnitBn(totalUnclaimed, units).toFormat(),
          2
        ),
      }}
      dimmed={dimmed}
      buttons={
        Object.keys(unclaimedPayouts || {}).length > 0 &&
        !totalUnclaimed.isZero()
          ? [
              {
                title: t('claim', { ns: 'modals' }),
                icon: faCircleDown,
                disabled: !isReady || isReadOnlyAccount(activeAccount),
                small: true,
                onClick: () =>
                  openModal({
                    key: 'ClaimPayouts',
                    size: 'sm',
                    options: {
                      disableWindowResize: true,
                      disableScroll: true,
                    },
                  }),
              },
            ]
          : undefined
      }
    />
  );
};
