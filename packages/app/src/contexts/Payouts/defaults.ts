// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PayoutsContextInterface } from './types';

export const MaxSupportedPayoutEras = 7;

export const defaultPayoutsContext: PayoutsContextInterface = {
  payoutsSynced: 'unsynced',
  unclaimedPayouts: null,
  removeEraPayout: (era, validator) => {},
};
