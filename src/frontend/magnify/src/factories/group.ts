import { faker } from '@faker-js/faker';
import { Group } from '../types/group';
import { Member } from '../types/member';
import { createRandomGroupMembers } from './member';

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
