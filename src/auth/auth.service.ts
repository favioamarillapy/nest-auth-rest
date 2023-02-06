import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async register(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;
      const passwordEncripted = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({ ...userData, password: passwordEncripted });
      await this.userRepository.save(user);
      delete user.password;
      
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.detail);
    }
  }

}
