import { ApiProperty } from '@nestjs/swagger';

export interface IAuthUser {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  access_token: string;
  user: IAuthUser;
}

export class AuthUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: '2024-02-17T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-17T12:00:00Z' })
  updatedAt: Date;
}

export class AuthResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  access_token: string;

  @ApiProperty()
  user: AuthUser;
}
