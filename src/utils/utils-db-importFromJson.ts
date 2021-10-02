export const schemaToImport179 = {
    database: 'db-issue179',
    version: 1,
    encrypted: false,
    mode: 'full',
    tables: [
      {
        name: 'album',
        schema: [
          { column: 'albumartist', value: 'TEXT NOT NULL' },
          { column: 'albumname', value: 'TEXT NOT NULL' },
          { column: 'albumcover', value: 'BINARY' },
          { column: 'last_modified', value: 'INTEGER' },
          { constraint: 'PK_albumartist_albumname', value: 'PRIMARY KEY (albumartist,albumname)'},
        ],
        indexes: [
          { name: 'index_album_on_albumartist_albumname', value: 'albumartist,albumname' },
          { name: 'index_album_on_last_modified', value: 'last_modified DESC' },
        ],
      },
      {
        name: 'song',
        schema: [
          { column: 'songid', value: 'INTEGER PRIMARY KEY NOT NULL' },
          { column: 'songartist', value: 'TEXT NOT NULL' },
          { column: 'songalbum', value: 'TEXT NOT NULL' },
          { column: 'songname', value: 'TEXT NOT NULL' },
          { column: 'last_modified', value: 'INTEGER' },
          {
            foreignkey: 'songartist,songalbum',
            value: 'REFERENCES album(albumartist,albumname)',
          },
        ],
        indexes: [
            { name: 'index_song_on_songartist_songalbum', value: 'songartist,songalbum' },
            {
            name: 'index_song_on_last_modified',
            value: 'last_modified DESC',
          },
        ],
      },
    ],
  };