// 72 names
const firstNames = ['John', 'Jane', 'Bob', 'Mary', 'Jack', 'Jill', 'Adam', 'Julie', 'Bobby'];
const lastNames = ['Doe', 'Eddy', 'Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller'];
const names = firstNames
  .map((firstName) => lastNames.map((lastName) => `${firstName} ${lastName}`))
  .flat();

// 72 members
export const mockedMembers = names.map(
  (
    name,
    index,
  ): {
    name: string;
    avatar: string;
    id: string;
  } => ({
    id: `id-${index}`,
    name,
    avatar: `https://i.pravatar.cc/64?img=${index}`,
  }),
);

export const mockedGroups = [
  { id: '1', name: 'A group with a longer name', members: mockedMembers.slice(0, 3) },
  { id: '2', name: 'Group 2', members: mockedMembers.slice(3, 12) },
  { id: '3', name: 'Group 3', members: mockedMembers.slice(12, 35) },
  { id: '4', name: 'Group 4', members: mockedMembers.slice(35, 36) },
];
