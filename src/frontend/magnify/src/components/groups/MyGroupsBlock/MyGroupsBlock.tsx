import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useController } from '../../../controller';
import GroupsList from '../GroupsList';

const MyGroupsBlock = () => {
  const controller = useController();
  const { data } = useQuery(['groups'], controller.getGroups);

  if (!data) {
    return null;
  }
  return <GroupsList groups={data} />;
};

export default MyGroupsBlock;
