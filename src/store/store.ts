import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

interface Store {
  users: User[];
  artists: Artist[];
  albums: Album[];
}
export const store: Store = {
  users: [],
  artists: [],
  albums: [],
};
