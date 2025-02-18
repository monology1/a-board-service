import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 'Software developer from NYC', description: 'User biography' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: true, description: 'Whether the user account is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'user', description: 'User role', enum: ['user', 'admin'] })
  @IsString()
  role: string;

  @ApiProperty({ example: '2025-02-18T02:23:00.721Z', description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-02-18T02:23:00.721Z', description: 'Last update date' })
  updatedAt: Date;
}