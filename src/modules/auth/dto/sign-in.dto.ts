import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  //swagger
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  username: string;
}
