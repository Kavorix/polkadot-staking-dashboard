// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';

export const usePoolCommission = (id: number) => {
  const { getBondedPool } = useBondedPools();
  const bondedPool = getBondedPool(id);
  const { stats } = usePoolsConfig();
  const { globalMaxCommission } = stats;

  const getCommission = () => {
    const currentCommission = Math.min(
      Number(bondedPool?.commission?.current?.[0].slice(0, -1)),
      globalMaxCommission
    );

    return `${currentCommission}%`;
  };
  return { getCommission };
};
