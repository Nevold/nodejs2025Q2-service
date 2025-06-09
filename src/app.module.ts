import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DatabaseModule } from './database/database.module';
import { UserEntity } from './user/entities/user.entity';
import { ArtistEntity } from './artist/entities/artist.entity';
import { AlbumEntity } from './album/entities/album.entity';
import { TrackEntity } from './track/entities/track.entity';
import {
  FavoriteAlbum,
  FavoriteArtist,
  FavoriteTrack,
} from './favorites/entities/favorites.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        ArtistEntity,
        AlbumEntity,
        TrackEntity,
        FavoriteArtist,
        FavoriteAlbum,
        FavoriteTrack,
      ],
      synchronize: false,
      logging: true,
      migrationsRun: true,
      extra: {
        poolSize: 10,
        connectionTimeoutMillis: 5000,
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ArtistEntity,
      AlbumEntity,
      TrackEntity,
      FavoriteArtist,
      FavoriteAlbum,
      FavoriteTrack,
    ]),
    DatabaseModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
  ],
})
export class AppModule {}
