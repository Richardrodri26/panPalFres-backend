import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { PaginationDto } from 'src/common/dtos/pagination.dto';
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

  async getUsers(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto

      const totalUsers = await this.userRepository.count();

    const usersData = await this.userRepository.find({
      take: limit,
        skip: offset,
    })

    const totalPages = Math.ceil(totalUsers / limit);

    // Calcular la página actual (usando el offset)
    const currentPage = Math.floor(offset / limit) + 1;

    // return usersData

    return {
      data: usersData,
      totalItems: totalUsers,
      totalPages,
      currentPage,
      limit,
    }
    
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async getUserById(id: string) {
    try {
    const userData = await this.userRepository.findOneBy({
      id
    })

    return userData

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async updateUser (id: string, updateUserDto: UpdateAuthDto) {
    const userData = await this.userRepository.findOneBy({ id })

    if(!userData) throw new NotFoundException(`User with id: ${ id } not found`)

      try {
       await this.userRepository.update(
        id,
        updateUserDto
       );

       return {...userData, ...updateUserDto}
      } catch (error) {
        this.handleDBErrors(error)
      }

  }

  async removeUser (id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id })
      await this.userRepository.remove(user)

      return user

    } catch (error) {
      this.handleDBErrors(error)
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
