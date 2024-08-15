import { Connection } from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import dbConstants from 'src/db/db.constants';
import usersConstants from './users.contants';

export const usersProvider = [
  {
    provide: usersConstants.USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(usersConstants.USER, UserSchema),
    inject: [dbConstants.DATABASE_CONNECTION],
  },
];
