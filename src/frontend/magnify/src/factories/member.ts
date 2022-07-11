import { faker } from '@faker-js/faker';
import { Member } from '../types/member';

export function createRandomGroupMember(): Member {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    avatar: faker.image.avatar(),
  };
}

export function createRandomGroupMembers(count: number, userToInclude?: Member): Member[] {
  return Array.from({ length: count }, (_v, index) =>
    index === 0 && userToInclude ? userToInclude : createRandomGroupMember(),
  );
}
