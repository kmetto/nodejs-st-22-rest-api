import {
  Injectable,
  BadRequestException,
  BadGatewayException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DbUsers {
  private readonly filteredUserSelect = {
    id: true,
    login: true,
    password: true,
    age: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  private catchPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      process.exit(1);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      throw new InternalServerErrorException(
        `Attempt to use invalid value in database.`,
      );
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new BadRequestException('Unique constraint failed.');
        case 'P2025':
          throw new NotFoundException(
            'One or more records that were required but not found.',
          );
        default:
          throw new BadGatewayException('Database related error occurred.');
      }
    } else {
      throw new InternalServerErrorException();
    }
  }

  findManyByLogin(limit: number, loginSubstring: string) {
    return this._findManyByLogin(limit, loginSubstring).catch(
      this.catchPrismaError,
    );
  }

  findOneById(id: string) {
    return this._findOneById(id).catch(this.catchPrismaError);
  }

  create(createUserDto: CreateUserDto) {
    return this._create(createUserDto).catch(this.catchPrismaError);
  }

  updateById(id: string, updateUserDto: UpdateUserDto) {
    return this._updateById(id, updateUserDto).catch(this.catchPrismaError);
  }

  deleteById(id: string) {
    return this._deleteById(id).catch(this.catchPrismaError);
  }

  private async _findManyByLogin(limit: number, loginSubstring: string) {
    const users = await this.prisma.user.findMany({
      take: limit,
      orderBy: { login: 'asc' },
      where: {
        isDeleted: false,
        login: { startsWith: loginSubstring },
      },
      select: this.filteredUserSelect,
    });

    return users;
  }

  private async _findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id_isDeleted: {
          id: id,
          isDeleted: false,
        },
      },
      select: this.filteredUserSelect,
    });

    return user;
  }

  private async _create({ login, password, age }: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: { login, password, age },
      select: this.filteredUserSelect,
    });

    return newUser;
  }

  private async _updateById(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id_isDeleted: {
          id: id,
          isDeleted: false,
        },
      },
      data: updateUserDto,
      select: this.filteredUserSelect,
    });

    return updatedUser;
  }

  private async _deleteById(id: string) {
    const deletedUser = await this.prisma.user.update({
      where: {
        id_isDeleted: {
          id: id,
          isDeleted: false,
        },
      },
      data: { isDeleted: true },
      select: this.filteredUserSelect,
    });

    return deletedUser;
  }
}
