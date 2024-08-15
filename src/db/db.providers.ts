import * as mongoose from 'mongoose';
import dbConstants from './db.constants';

export const dbProviders = [
  {
    provide: dbConstants.DATABASE_CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(dbConstants.CONNECTION_STRING),
  },
];
