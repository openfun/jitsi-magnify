import { Group } from '../types/group';
import { faker } from '@faker-js/faker';
import { createRandomGroupMembers } from './member';
import { Member } from '../types/member';

export default function createRandomGroup(
  numberOfMembers: number,
  nameLenght = 3,
  userToInclude?: Member,
): Group {
  return {
    id: faker.datatype.uuid(),
    name: `${faker.lorem.words(nameLenght)}`,
    members: createRandomGroupMembers(numberOfMembers, userToInclude),
  };
}
