import { ComponentMeta, ComponentStory } from '@storybook/react';
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
} as ComponentMeta<typeof UserSearchModal>;

const Template: ComponentStory<typeof UserSearchModal> = (args) => {
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

// create the template and stories
export const basic = Template.bind({});
export const error = Template.bind({});

error.parameters = {
  msw: {
    handlers: [
      rest.get(buildApiUrl(UsersApiRoutes.SEARCH), (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      }),
    ],
  },
};
