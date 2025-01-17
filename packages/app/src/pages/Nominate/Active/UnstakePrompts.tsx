// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useSyncing } from 'hooks/useSyncing';
import { useUnstaking } from 'hooks/useUnstaking';
import { useOverlay } from 'kits/Overlay/Provider';
import { CardWrapper } from 'library/Card/Wrappers';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from 'ui-buttons';
import { ButtonRow, PageRow } from 'ui-structure';

export const UnstakePrompts = () => {
  const { t } = useTranslation('pages');
  const { mode } = useTheme();
  const { syncing } = useSyncing();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { unit, colors } = useNetwork().networkData;
  const { isFastUnstaking, isUnstaking, getFastUnstakeText } = useUnstaking();

  const { getTransferOptions } = useTransferOptions();
  const { active, totalUnlockChunks, totalUnlocked, totalUnlocking } =
    getTransferOptions(activeAccount).nominate;
  const annuncementBorderColor = colors.secondary[mode];

  // unstaking can withdraw
  const canWithdrawUnlocks =
    isUnstaking &&
    active.isZero() &&
    totalUnlocking.isZero() &&
    !totalUnlocked.isZero();

  return (
    (isUnstaking || isFastUnstaking) &&
    !syncing && (
      <PageRow>
        <CardWrapper style={{ border: `1px solid ${annuncementBorderColor}` }}>
          <div className="content">
            <h3>
              {t('nominate.unstakePromptInProgress', {
                context: isFastUnstaking ? 'fast' : 'regular',
              })}
            </h3>
            <h4>
              {isFastUnstaking
                ? t('nominate.unstakePromptInQueue')
                : !canWithdrawUnlocks
                  ? t('nominate.unstakePromptWaitingForUnlocks')
                  : `${t('nominate.unstakePromptReadyToWithdraw')} ${t(
                      'nominate.unstakePromptRevert',
                      { unit }
                    )}`}
            </h4>
            <ButtonRow yMargin>
              {isFastUnstaking ? (
                <ButtonPrimary
                  marginRight
                  iconLeft={faBolt}
                  text={getFastUnstakeText()}
                  onClick={() =>
                    openModal({ key: 'ManageFastUnstake', size: 'sm' })
                  }
                />
              ) : (
                <ButtonPrimary
                  iconLeft={faLockOpen}
                  text={
                    canWithdrawUnlocks
                      ? t('nominate.unlocked')
                      : String(totalUnlockChunks ?? 0)
                  }
                  disabled={false}
                  onClick={() =>
                    openModal({
                      key: 'UnlockChunks',
                      options: {
                        bondFor: 'nominator',
                        poolClosure: true,
                        disableWindowResize: true,
                        disableScroll: true,
                      },
                      size: 'sm',
                    })
                  }
                />
              )}
            </ButtonRow>
          </div>
        </CardWrapper>
      </PageRow>
    )
  );
};
