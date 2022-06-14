const names = ['John', 'Jane', 'Bob', 'Mary', 'Jack', 'Jill', 'Adam', 'Julie', 'Bobby'];
export const mockedMembers = names.map((name, index): {
  name: string;
  avatar: string;
  id: string;
} => ({
  id: `id-${index}`,
  name: `${name} Doe`,
  avatar: `https://i.pravatar.cc/64?img=${index}`,
}));
export const mockedGroup9Members = { id: '1', name: 'Group 1', members: mockedMembers };
export const mockedGroup3Members = { id: '2', name: 'Group 2', members: mockedMembers.slice(0, 3) };
