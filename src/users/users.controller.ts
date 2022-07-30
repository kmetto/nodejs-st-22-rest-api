import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findMany(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('loginSubstring', new DefaultValuePipe(''))
    loginSubstring: string,
  ) {
    const users = await this.usersService.findManyByLogin(
      limit,
      loginSubstring,
    );
    return users;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post()
  async createOne(
    @Body(CustomValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(CustomValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateById(id, updateUserDto);
    return updatedUser;
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    const deletedUser = await this.usersService.deleteById(id);
    return deletedUser;
  }
}
