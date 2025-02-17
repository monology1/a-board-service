import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { IAuthResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signin(dto: SignInDto): Promise<IAuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      access_token: 'token',
      user,
    };
  }
}
