import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

export interface Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
