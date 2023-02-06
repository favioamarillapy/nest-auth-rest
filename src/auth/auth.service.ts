import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtInterface } from './interfaces/Jwt.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async register(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;
      const passwordEncripted = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({ ...userData, password: passwordEncripted });
      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user, token:
          this.generateJwt({ email: user.email })
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {

      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, fullName: true }
      });

      if (!user) {
        throw new UnauthorizedException("Email are not valid");
      }

      if (!bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException("Password are not valid");
      }

      delete user.password;

      return {
        ...user,
        token: this.generateJwt({ email: user.email })
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

  private generateJwt(payload: JwtInterface) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
