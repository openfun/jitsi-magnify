import { faker } from '@faker-js/faker';
import { Profile } from '../types/profile';

export function createRandomProfile(): Profile {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    avatar: faker.image.avatar(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
  };
}
