import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Create mock AuthService
  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return auth response when credentials are valid', async () => {
      // Arrange
      const signInDto: SignInDto = { username: 'testuser' };
      const mockResponse = {
        access_token: 'test_token',
        user: {
          id: 1,
          username: 'testuser',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      mockAuthService.signIn.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.signIn(signInDto);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});