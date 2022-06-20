import { AuthGuard } from './guards/auth.guard';
import { CurrentUserInterceptor } from './interceptors/current-user-interceptor';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/signout')
  signout(@Session() Session: any) {
    return (Session.userId = null);
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() Session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    Session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() Session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    Session.userId = user.id;
    return user;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log('handler is running.');
    const user = this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Body() body: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.update(parseInt(id), body);
  }
}
