import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from 'src/application/dtos/auth/register-user.dto';
import { User } from 'src/domain/entites/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { AppException } from 'src/infraestructure/exceptions/app.exception';

@Injectable()
export class RegisterUserUseCase {
  private readonly logger: Logger;

  constructor(private readonly userRepository: IUserRepository) {
    this.logger = new Logger(RegisterUserUseCase.name);
  }

  async execute(dto: RegisterUserDto) {
    const existingUser = await this.userRepository.findByUsename(dto.username);

    if (existingUser)
      throw new AppException(
        `User with username ${existingUser.username} alredy exists.`,
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User({
      ...dto,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.create(user);

    return createdUser;
  }
}
