import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbUsers } from 'src/db/services/db-users.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbUsers: DbUsers) {}

  async findManyByLogin(limit: number, loginSubstring: string) {
    const users = await this.dbUsers.findManyByLogin(limit, loginSubstring);
    return users;
  }

  async findOneById(id: string) {
    const user = await this.dbUsers.findOneById(id);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.dbUsers.create(createUserDto);
    return newUser;
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.dbUsers.updateById(id, updateUserDto);
    return updatedUser;
  }

  async deleteById(id: string) {
    const deletedUser = await this.dbUsers.deleteById(id);
    return deletedUser;
  }
}
