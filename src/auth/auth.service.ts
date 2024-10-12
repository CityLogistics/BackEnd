import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenPurpose } from './entities/token.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResetPasswordInitiatedEvent } from './events/reset-password-initiated.event';
import { RESET_PASSWORD_INITIATED } from 'src/common/jobs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private eventEmitter: EventEmitter2,
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
      cities: user.cities,
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

  async forgotPassword(email: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) throw new BadRequestException('User not found');

    const tokenExists = await this.tokenModel.findOne({
      email,
      purpose: TokenPurpose.RESET_PASSWORD,
    });

    if (tokenExists) throw new BadRequestException('Invalid token');

    const token = this.jwtService.sign({ email });

    await this.tokenModel.create({
      email,
      purpose: TokenPurpose.RESET_PASSWORD,
      token,
    });

    const resetPasswordInitiatedEvent = new ResetPasswordInitiatedEvent();
    resetPasswordInitiatedEvent.email = email;
    resetPasswordInitiatedEvent.token = token;
    resetPasswordInitiatedEvent.name = user.firstName;

    this.eventEmitter.emit(
      RESET_PASSWORD_INITIATED,
      resetPasswordInitiatedEvent,
    );

    return { status: true };
  }
}
