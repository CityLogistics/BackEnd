import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
// import { usersProvider } from 'src/users/users.providers';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 600000 },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    // ...usersProvider,
  ],
})
export class AuthModule {}
