import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ArtistEntity, Artist } from '../../artist/entities/artist.entity';
import { Track, TrackEntity } from '../../track/entities/track.entity';

@Entity('albums')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums, {
    onDelete: 'SET NULL',
  })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;

  @OneToMany(() => TrackEntity, (track) => track.album)
  tracks: Track[];
}
export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}
