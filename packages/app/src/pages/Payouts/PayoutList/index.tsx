// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { StakingContext } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { formatDistance, fromUnixTime } from 'date-fns';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { payoutsPerPage } from 'library/List/defaults';
import { Identity } from 'library/ListItem/Labels/Identity';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import { planckToUnitBn } from 'library/Utils';
import { DefaultLocale, locales } from 'locales';
import { Component, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnySubscan } from 'types';
import { ItemWrapper } from '../Wrappers';
import type { PayoutListProps } from '../types';
import { PayoutListProvider, usePayoutList } from './context';

export const PayoutListInner = ({
  allowMoreCols,
  pagination,
  title,
  payouts: initialPayouts,
}: PayoutListProps) => {
  const { i18n, t } = useTranslation('pages');
  const { mode } = useTheme();
  const { isReady, activeEra } = useApi();
  const {
    networkData: { units, unit, colors },
  } = useNetwork();
  const { listFormat, setListFormat } = usePayoutList();
  const { validators } = useValidators();
  const { bondedPools } = useBondedPools();

  // current page
  const [page, setPage] = useState<number>(1);

  // manipulated list (ordering, filtering) of payouts
  const [payouts, setPayouts] = useState<AnySubscan>(initialPayouts);

  // is this the initial fetch
  const [fetched, setFetched] = useState<boolean>(false);

  // pagination
  const totalPages = Math.ceil(payouts.length / payoutsPerPage);
  const pageEnd = page * payoutsPerPage - 1;
  const pageStart = pageEnd - (payoutsPerPage - 1);

  // refetch list when list changes
  useEffect(() => {
    setFetched(false);
  }, [initialPayouts]);

  // configure list when network is ready to fetch
  useEffect(() => {
    if (isReady && !activeEra.index.isZero() && !fetched) {
      setPayouts(initialPayouts);
      setFetched(true);
    }
  }, [isReady, fetched, activeEra.index]);

  // get list items to render
  let listPayouts = [];

  // get throttled subset or entire list
  listPayouts = payouts.slice(pageStart).slice(0, payoutsPerPage);

  if (!payouts.length) {
    return null;
  }

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={listFormat === 'row' ? colors.primary[mode] : 'inherit'}
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={listFormat === 'col' ? colors.primary[mode] : 'inherit'}
            />
          </button>
        </div>
      </Header>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}
        <MotionContainer>
          {listPayouts.map((p: AnySubscan, index: number) => {
            const label =
              p.event_id === 'PaidOut'
                ? t('payouts.poolClaim')
                : p.event_id === 'Rewarded'
                  ? t('payouts.payout')
                  : p.event_id;

            const labelClass =
              p.event_id === 'PaidOut'
                ? 'claim'
                : p.event_id === 'Rewarded'
                  ? 'reward'
                  : undefined;

            // get validator if it exists
            const validator = validators.find(
              (v) => v.address === p.validator_stash
            );

            // get pool if it exists
            const pool = bondedPools.find(({ id }) => id === p.pool_id);

            const batchIndex = validator
              ? validators.indexOf(validator)
              : pool
                ? bondedPools.indexOf(pool)
                : 0;

            return (
              <motion.div
                className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                key={`nomination_${index}`}
                variants={{
                  hidden: {
                    y: 15,
                    opacity: 0,
                  },
                  show: {
                    y: 0,
                    opacity: 1,
                  },
                }}
              >
                <ItemWrapper>
                  <div className="inner">
                    <div className="row">
                      <div>
                        <div>
                          <h4 className={labelClass}>
                            <>
                              {p.event_id === 'Slashed' ? '-' : '+'}
                              {planckToUnitBn(
                                new BigNumber(p.amount),
                                units
                              ).toString()}{' '}
                              {unit}
                            </>
                          </h4>
                        </div>
                        <div>
                          <h5 className={labelClass}>{label}</h5>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div>
                        <div>
                          {label === t('payouts.payout') &&
                            (batchIndex > 0 ? (
                              <Identity address={p.validator_stash} />
                            ) : (
                              <div>{ellipsisFn(p.validator_stash)}</div>
                            ))}
                          {label === t('payouts.poolClaim') &&
                            (pool ? (
                              <PoolIdentity pool={pool} />
                            ) : (
                              <h4>
                                {t('payouts.fromPool')} {p.pool_id}
                              </h4>
                            ))}
                          {label === t('payouts.slashed') && (
                            <h4>{t('payouts.deductedFromBond')}</h4>
                          )}
                        </div>
                        <div>
                          <h5>
                            {formatDistance(
                              fromUnixTime(p.block_timestamp),
                              new Date(),
                              {
                                addSuffix: true,
                                locale:
                                  locales[
                                    i18n.resolvedLanguage ?? DefaultLocale
                                  ].dateFormat,
                              }
                            )}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </ItemWrapper>
              </motion.div>
            );
          })}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const PayoutList = (props: PayoutListProps) => (
  <PayoutListProvider>
    <PayoutListShouldUpdate {...props} />
  </PayoutListProvider>
);

export class PayoutListShouldUpdate extends Component {
  static contextType = StakingContext;

  render() {
    return <PayoutListInner {...this.props} />;
  }
}
