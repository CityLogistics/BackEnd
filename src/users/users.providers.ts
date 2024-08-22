import { Connection } from 'mongoose';
import dbConstants from 'src/db/db.constants';
import usersConstants from './users.contants';
import { UserSchema } from './entities/user.entity';

export const usersProvider = [
  {
    provide: usersConstants.USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(usersConstants.USER, UserSchema),
    inject: [dbConstants.DATABASE_CONNECTION],
  },
];
