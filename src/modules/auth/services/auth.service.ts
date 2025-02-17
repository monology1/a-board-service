import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import { IAuthResponse } from '../interfaces/auth.interface';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<IAuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const access_token = await this.jwtService.generateToken(user.id);

    return {
      access_token,
      user,
    };
  }
}
