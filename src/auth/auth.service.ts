import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    try {
      const { password, ...userData } = createUserDto
      const user = this.userRepository.create({ ...userData, password: bcrypt.hashSync(password, 10) })
      await this.userRepository.save(user)

      delete user.password
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
       }

    } catch (error) {
      this.handleDBErrors(error)
    }

  }


  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email }, 
      select: { email: true, password: true, id: true }
     })

     if(!user) {
      throw new UnauthorizedException('Credentials are not valid (email)')
     }

     if(!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)')
     }

     return {
      ...user,
      token: this.getJwtToken({ id: user.id })
     }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }


  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
     }
  }

  private handleDBErrors(error: any): never {
    if( error.code === "23505" ) {
      throw new BadRequestException(error.detail)
    }
    console.log(error)

    throw new InternalServerErrorException('Please check server logs')

  }
}
