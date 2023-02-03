import { User } from 'src/user/entities/user.entity';

interface Store {
  users: User[];
}
export const store: Store = {
  users: [],
};
