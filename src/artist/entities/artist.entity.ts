import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album, AlbumEntity } from '../../album/entities/album.entity';
import { Track, TrackEntity } from '../../track/entities/track.entity';
export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

@Entity('artists')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artist, {
    onDelete: 'SET NULL',
  })
  albums: Album[];

  @OneToMany(() => TrackEntity, (track) => track.artist, {
    onDelete: 'SET NULL',
  })
  tracks: Track[];
}
