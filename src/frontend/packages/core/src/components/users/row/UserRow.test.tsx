import React from 'react';
import { describe, expect, it } from 'vitest';

import createRandomUser from '../../../factories/users';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { UserRow } from './UserRow';

describe('RowUserBase', () => {
  it('should render successfully without border', async () => {
    const randomUser = createRandomUser();
    const { container } = renderWrappedInTestingProvider(
      <UserRow isSelected={false} user={randomUser} />,
    );

    const row = container.querySelector(`#user-${randomUser.id}`);
    expect(row).not.toEqual(null);
    expect(row).toHaveStyle('border: 1px solid transparent');
  });

  it('should render successfully with border', async () => {
    const randomUser = createRandomUser();
    const { container } = renderWrappedInTestingProvider(
      <UserRow isSelected={true} user={randomUser} />,
    );

    const row = container.querySelector(`#user-${randomUser.id}`);
    expect(row).not.toEqual(null);
    expect(row).toHaveStyle('border: 1px solid #055fd2');
  });
});
