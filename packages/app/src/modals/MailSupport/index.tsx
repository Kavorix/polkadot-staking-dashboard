// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MailSupportAddress } from 'consts';
import MailSVG from 'img/mail.svg?react';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { SupportWrapper } from './Wrapper';

export const MailSupport = () => {
  const { t } = useTranslation('modals');
  return (
    <>
      <Title />
      <ModalPadding verticalOnly>
        <SupportWrapper>
          <MailSVG />
          <h4>{t('supportEmail')}</h4>
          <h1>{MailSupportAddress}</h1>
        </SupportWrapper>
      </ModalPadding>
    </>
  );
};
