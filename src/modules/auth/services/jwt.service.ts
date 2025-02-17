import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(userId: number): Promise<string> {
    return this.jwtService.sign({ sub: userId });
  }

  async verifyToken(token: string): Promise<Object> {
    return this.jwtService.verify(token);
  }
}
