import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { Auth, GetUser } from "./decorators";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post("register")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("check-status")
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get("users")
  @Auth()
  getUsers(@Query() paginationDto: PaginationDto) {
    return this.authService.getUsers(paginationDto);
  }

  @Get("users/:id")
  @Auth()
  getUserById(@Param("id") id: string) {
    return this.authService.getUserById(id);
  }

  @Patch("users/:id")
  // @Auth(ValidRoles.admin)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateAuthDto,
    // @GetUser() user: User,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete("users/:id")
  // @Auth(ValidRoles.admin)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.authService.removeUser(id);
  }

  @Get("user-report")
  async getUsersReport(@Res() response: Response) {
    const pdfDoc = await this.authService.getUsersReport();

    response.setHeader("Content-Type", "application/pdf");
    pdfDoc.info.Title = "Billing-Report";
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
