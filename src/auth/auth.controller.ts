import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeader, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles.interface';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  private(
    @GetUser() user: User,
    @RawHeader() header: string[],
  ) {
    return { user, header };
  }

  @Get('private2')
  @RoleProtected()
  @UseGuards(AuthGuard(), UserRoleGuard)
  private2(
    @GetUser() user: User,
    @RawHeader() header: string[],
  ) {
    return { user, header };
  }

  @Get('private3')
  @Auth()
  private3(
    @GetUser() user: User,
    @RawHeader() header: string[],
  ) {
    return { user, header };
  }

}
