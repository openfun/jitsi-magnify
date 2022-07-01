import React from 'react';
import { useQuery } from 'react-query';
import { useController } from '../../../controller';
import GroupsList from '../GroupsList';
import { Card } from 'grommet';

const MyGroupsBlock = () => {
  const controller = useController();
  const { data } = useQuery('groups', controller.getGroups);

  if (!data) {
    return null;
  }
  return <GroupsList groups={data} />;
};

export default MyGroupsBlock;
