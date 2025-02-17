import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let jwtService: NestJwtService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    jwtService = module.get<NestJwtService>(NestJwtService);
  });

  describe('generateToken', () => {
    it('should generate token with user id', async () => {
      // Arrange
      const userId = 1;
      const mockToken = 'mock_token';
      mockJwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await service.generateToken(userId);

      // Assert
      expect(result).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId });
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token payload when token is valid', async () => {
      // Arrange
      const token = 'valid_token';
      const payload = { sub: 1 };
      mockJwtService.verify.mockReturnValue(payload);

      // Act
      const result = await service.verifyToken(token);

      // Assert
      expect(result).toEqual(payload);
    });

    it('should throw error when token is invalid', async () => {
      // Arrange
      const token = 'invalid_token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(service.verifyToken(token)).rejects.toThrow();
    });
  });
});
