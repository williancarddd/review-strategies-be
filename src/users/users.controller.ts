import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { ZodPipe } from 'src/commons/pipe/zod.pipe';
import { UsersService } from './users.service';
import { Public } from 'src/commons/decorators/public.decorators';
import { PasswordRecoveryService } from './password-recovery.service';


@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) { }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Public()
  @Post()
  create(@Body(new ZodPipe(CreateUserSchema)) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Request password recovery', })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Recovery code sent to email.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Public()
  @Post('password-recovery')
  requestPasswordRecovery(@Body() body: { email: string }) {
    return this.passwordRecoveryService.requestPasswordRecovery(body.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, code: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password successfully reset.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: { email: string, code: string, password: string }) {
    return this.passwordRecoveryService.verifyRecoveryCode(body.email, body.code, body.password);
  }


  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
