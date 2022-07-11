import { faker } from '@faker-js/faker';
import { Group } from '../types/group';
import { Member } from '../types/member';
import createRandomGroup from './group';

export default function createRandomGroups(
  numberOfGroups: number,
  userToInclude?: Member,
): Group[] {
  return Array.from({ length: numberOfGroups }, (_v, index) =>
    createRandomGroup(
      faker.datatype.number({ min: 1, max: 10 }),
      3,
      index === 0 ? userToInclude : undefined,
    ),
  );
}
