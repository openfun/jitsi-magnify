import { Meta, StoryFn } from '@storybook/react';
import { Button } from 'grommet';
import { rest } from 'msw';
import React from 'react';
import { buildApiUrl } from '../../../services';
import { UsersApiRoutes } from '../../../utils';
import { useMagnifyModal } from '../../design-system/Modal';
import { UserSearchModal } from '.';

export default {
  title: 'Users/SearchModal',
  component: UserSearchModal,
} as Meta<typeof UserSearchModal>;

const Template: StoryFn<typeof UserSearchModal> = (args) => {
  const modal = useMagnifyModal();
  return (
    <>
      <Button primary label="show modal" onClick={() => modal.openModal()} />
      <UserSearchModal
        {...modal}
        {...args}
        onSelectUser={() => {
          modal.closeModal();
        }}
      />
    </>
  );
};

export const basic = {
  render: Template,
};

export const error = {
  render: Template,

  parameters: {
    msw: {
      handlers: [
        rest.get(buildApiUrl(UsersApiRoutes.SEARCH), (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({}));
        }),
      ],
    },
  },
};
