import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { JwtService } from './jwt.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;  // Declare at the top level

  // Create mocks
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  // Create mock for JwtService
  const mockJwtService = {
    generateToken: jest.fn().mockResolvedValue('mock_token'),
    verifyToken: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    // Get service instances
    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('signin', () => {
    it("should return user token when username exists", async () => {
      // Arrange
      const username = "test";
      const mockUser = {
        id: 1,
        username: 'test',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.generateToken.mockResolvedValue('mock_token');

      // Act
      const result = await service.signIn({ username });

      // Assert
      expect(result.access_token).toBe('mock_token');
      expect(result.user).toEqual(mockUser);
      expect(mockJwtService.generateToken).toHaveBeenCalledWith(mockUser.id);  // Use mockJwtService instead
    });

    it("should throw UnauthorizedException when user does not exist", async () => {
      // Arrange
      const username = "nonexistent";
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.signIn({ username }))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});