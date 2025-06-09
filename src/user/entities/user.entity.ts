import {
  FavoriteAlbum,
  FavoriteArtist,
  FavoriteTrack,
} from '../../favorites/entities/favorites.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;

  @OneToMany(() => FavoriteArtist, (favoriteArtist) => favoriteArtist.user)
  favoriteArtists: FavoriteArtist[];

  @OneToMany(() => FavoriteAlbum, (favoriteAlbum) => favoriteAlbum.user)
  favoriteAlbums: FavoriteAlbum[];

  @OneToMany(() => FavoriteTrack, (favoriteTrack) => favoriteTrack.user)
  favoriteTracks: FavoriteTrack[];
}
