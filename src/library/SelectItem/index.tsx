// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from './Wrapper';

export const SelectItem = ({
  title,
  subtitle,
  icon,
  selected,
  onClick,
  includeToggle = true,
}: any) => {
  return (
    <Wrapper selected={selected}>
      <button type="button" onClick={() => onClick()}>
        <div className="icon">
          <FontAwesomeIcon icon={icon} transform="grow-8" />
        </div>
        <div className="body">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {includeToggle ? (
          <div className="toggle">
            <FontAwesomeIcon
              icon={selected ? faCircleCheck : faCircle}
              transform="grow-10"
            />
          </div>
        ) : null}
      </button>
    </Wrapper>
  );
};
