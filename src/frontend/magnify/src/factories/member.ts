import { faker } from '@faker-js/faker';
import { Member } from '../types/member';

export function createRandomGroupMember(): Member {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    avatar: faker.image.avatar(),
  };
}

export function createRandomGroupMembers(count: number): Member[] {
  return Array.from({ length: count }, () => createRandomGroupMember());
}
