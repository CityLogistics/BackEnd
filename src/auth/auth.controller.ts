import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { loginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: loginDto,
  })
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changeUserPassword(
      req.user.id,
      changePasswordDto.password,
      changePasswordDto.newPassword,
    );
  }
}
