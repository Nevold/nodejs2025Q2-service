import { Artist, ArtistEntity } from '../../artist/entities/artist.entity';
import { Album, AlbumEntity } from '../../album/entities/album.entity';
import { Track, TrackEntity } from '../../track/entities/track.entity';
import { User, UserEntity } from '../../user/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity('favorites_artists')
export class FavoriteArtist {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  artistId: string;

  @ManyToOne(() => UserEntity, (user) => user.favoriteArtists, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ArtistEntity, { onDelete: 'CASCADE' })
  artist: Artist;
}

@Entity('favorites_albums')
export class FavoriteAlbum {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  albumId: string;

  @ManyToOne(() => UserEntity, (user) => user.favoriteAlbums, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => AlbumEntity, { onDelete: 'CASCADE' })
  album: Album;
}

@Entity('favorites_tracks')
export class FavoriteTrack {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  trackId: string;

  @ManyToOne(() => UserEntity, (user) => user.favoriteTracks, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => TrackEntity, { onDelete: 'CASCADE' })
  track: Track;
}
export interface Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
