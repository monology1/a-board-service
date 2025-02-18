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
    it('should return auth response (only user) when credentials are valid', async () => {
      // Arrange
      const signInDto: SignInDto = { username: 'test' };
      const user = {
        id: 1,
        username: 'test',
        createdAt: new Date('2025-02-17T16:23:15.000Z'),
        updatedAt: new Date('2025-02-17T16:23:17.000Z'),
      };
      // The AuthService returns an object with access_token and user, but the controller
      // returns only { user } and sets the cookie.
      const mockResponse = {
        access_token: 'test_token',
        user,
      };
      mockAuthService.signIn.mockResolvedValue(mockResponse);

      // Create a fake response object with a mocked cookie method.
      const fakeRes = {
        cookie: jest.fn(),
      };

      // Act
      const result = await controller.signIn(signInDto, fakeRes as any);

      // Assert
      // The controller should return only the user object.
      expect(result).toEqual({ user });
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);

      // Check that the cookie was set with the expected options.
      expect(fakeRes.cookie).toHaveBeenCalledWith('access_token', 'test_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 36000000,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});