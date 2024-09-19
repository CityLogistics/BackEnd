import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
      const { password, ...others } = user;

      if (bcrypt.compareSync(pass, password)) return others;
      return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.email,
      id: user._id,
      role: user.role,
      driverId: user.driverId,
      province: user.province,
      firstName: user.firstName,
    };
    return { access_token: this.jwtService.sign(payload), user };
  }

  async changeUserPassword(
    userId: string,
    password: string,
    newPassword: string,
  ): Promise<any> {
    return this.usersService.updatePassword(userId, password, newPassword);
  }
}
