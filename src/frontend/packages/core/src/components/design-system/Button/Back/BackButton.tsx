import { Button } from '@openfun/cunningham-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../../../../i18n';
import { commonMessages } from '../../../../i18n/commonMessages';
import { CunninghamIcon } from '../../Icon/CunninghamIcon';

export const BackButton = () => {
  const navigate = useNavigate();
  const intl = useTranslations();
  return (
    <div>
      <Button
        color="tertiary"
        icon={<CunninghamIcon iconName="arrow_back" />}
        size="small"
        onClick={() => {
          navigate(-1);
        }}
      >
        {intl.formatMessage(commonMessages.back)}
      </Button>
    </div>
  );
};
