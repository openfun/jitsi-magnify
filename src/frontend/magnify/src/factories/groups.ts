import { faker } from '@faker-js/faker';
import { Group } from '../types/group';
import createRandomGroup from './group';

export default function createRandomGroups(numberOfGroups: number): Group[] {
  return Array.from({ length: numberOfGroups }, () =>
    createRandomGroup(faker.datatype.number({ min: 1, max: 10 })),
  );
}
