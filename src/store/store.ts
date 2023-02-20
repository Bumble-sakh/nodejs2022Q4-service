import { User } from 'src/user/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Fav } from 'src/favs/entities/fav.entity';

interface Store {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  favorites: Fav;
}
export const store: Store = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favorites: {
    artists: new Set(),
    albums: new Set(),
    tracks: new Set(),
  },
};
