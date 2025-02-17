import { Post, Body, Controller } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { IAuthResponse } from './interfaces/auth.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @ApiOperation({ summary: 'Sign in with username' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully signed in',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIs...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            createdAt: { type: 'string', example: '2024-02-17T12:00:00Z' },
            updatedAt: { type: 'string', example: '2024-02-17T12:00:00Z' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signIn(@Body() signInDto: SignInDto): Promise<IAuthResponse> {
    return this.authService.signIn(signInDto);
  }
}
