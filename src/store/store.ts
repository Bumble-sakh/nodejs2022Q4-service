import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';

interface Store {
  users: User[];
  artists: Artist[];
}
export const store: Store = {
  users: [],
  artists: [],
};
