import { faker } from '@faker-js/faker';
import { User } from '../../types';
import { MagnifyLocales } from '../../utils';

export default function createRandomUser(): User {
  return {
    id: faker.datatype.uuid(),
    username: faker.name.findName(),
    email: faker.internet.email(),
    language: MagnifyLocales.EN,
    name: faker.name.findName(),
  };
}

export const _users = [...Array(3)].map((value) => createRandomUser());
