// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Polkicon } from '@w3ux/react-polkicon';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBalances } from 'contexts/Balances';
import { useActivePool } from 'contexts/Pools/ActivePool';
import type { ActivePool } from 'contexts/Pools/ActivePool/types';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { Title } from 'library/Modal/Title';
import { useStatusButtons } from 'pages/Pools/Home/Status/useStatusButtons';
import { useTranslation } from 'react-i18next';
import { ButtonOption } from 'ui-buttons';
import { ContentWrapper } from './Wrappers';

// TODO: Deprecate this feature and revisit in the future where global admin features are more
// developed.
export const AccountPoolRoles = () => {
  const { t } = useTranslation('modals');
  const { getPoolMembership } = useBalances();
  const { options } = useOverlay().modal.config;
  const { activeAccount } = useActiveAccounts();

  const { who, activePools } = options;
  const membership = getPoolMembership(activeAccount);
  const { label } = useStatusButtons();

  // Delete membership from activePools if it exists
  delete activePools[membership?.poolId || -1];

  return (
    <>
      <Title title={t('allPoolRoles')} icon={faBars} />
      <ModalPadding>
        <ContentWrapper>
          {membership && (
            <>
              <h4>{label}</h4>
              <div className="items">
                <Button who={who} poolId={String(membership.poolId)} />
              </div>
            </>
          )}
          <h4>
            {t('activeRoles', {
              count: Object.keys(activePools)?.length || 0,
            })}
          </h4>
          <div className="items">
            {Object.entries(activePools).map(([key, item], i: number) => (
              <Button
                who={who}
                activePool={item as ActivePool}
                poolId={key}
                key={`all_roles_root_${i}`}
              />
            ))}
          </div>
        </ContentWrapper>
      </ModalPadding>
    </>
  );
};

const Button = ({
  who,
  activePool,
  poolId,
}: {
  who: string;
  activePool?: ActivePool;
  poolId: string;
}) => {
  const { t } = useTranslation('modals');
  const { setActivePoolId } = useActivePool();
  const { setModalStatus } = useOverlay().modal;

  const { roles } = activePool?.bondedPool || {};
  const stash = activePool?.addresses?.stash || '';

  return (
    <ButtonOption
      content
      disabled
      onClick={() => {
        setActivePoolId(poolId);
        setModalStatus('closing');
      }}
      className="item"
    >
      <div className="icon">
        <Polkicon address={stash} transform="grow-10" />
      </div>

      <div className="details">
        <h3>
          {t('pool')} {poolId}
          {roles?.root === who ? <span>{t('root')}</span> : null}
          {roles?.nominator === who ? <span>{t('nominator')}</span> : null}
          {roles?.bouncer === who ? <span>{t('bouncer')}</span> : null}
        </h3>
      </div>
    </ButtonOption>
  );
};
